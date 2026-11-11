#!/usr/bin/env python3
"""每日更新拳擊跟練的新影片清單（GitHub Actions 執行）。

做法（不需要 API 金鑰）：
1. 從 SEED_VIDEOS（已知好用的影片）找出它們的頻道 ID，存在 data/channels.json 快取
2. 讀每個頻道的公開 RSS（最新 15 部），只留標題跟拳擊有關的影片
3. 依標題自動判斷「健身拳擊遊戲 / 教練跟練」與強度
4. 寫入 videos-new.json，App 打開時會自動合併

若設定了 repo secret YOUTUBE_API_KEY，會額外用 YouTube 搜尋找最近 30 天的新影片。
"""
import json, os, re, sys, time, urllib.request, urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "videos-new.json")
CH_CACHE = os.path.join(ROOT, "data", "channels.json")
KEEP_DAYS = 120          # 清單只保留最近幾天上傳的影片
MAX_ITEMS = 80

# 用這些影片找出要追蹤的頻道（每個頻道放一部即可）
SEED_VIDEOS = [
    "YLhtPnGE5kE",  # tnkk：健身拳擊2 幾乎每天上傳
    "QPJ8MHGXgSM",  # FitBoxing3 晨練直播
    "0wx2CCrmXGI",  # 健身拳擊3 每日訓練
    "lKrgwGzo-yE",  # 健身拳擊2 深夜每日
    "3QX2b0-GF90",  # 中文 每日運動
    "E9mxCo5iD7k",  # 中文 運動記錄
    "-FaPnAVQwaw",  # Fitness Boxing 2 減重日記
    "c2Nw2h-GDd0",  # May 有氧拳擊
    "YpKHrsChCKw",  # WG Online
    "0IaQAaI0aos",  # 10 分鐘拳擊有氧
    "7PCYxd3uhVY",  # Nate Bower 空拳
    "grq7zfaAWLA",  # 20 分鐘空拳跟練
    "MC7niyr0rxo",  # 拳擊 Tabata
    "P475CpooIdE",  # 拳擊 HIIT
    "s_CsbU4yrmo",  # 客家電視 停動停動好健康
    "gbFyNmmYASQ",  # 古月拳館
]

BOX_KW = re.compile(r"box|ボクシング|ボクササイズ|拳擊|拳击|拳|shadow ?boxing|kickbox|fit ?boxing|フィットボクシング|복싱", re.I)
GAME_KW = re.compile(r"fit(ness)? ?boxing|フィットボクシング|健身拳擊|피트니스 ?복싱|fitboxing", re.I)
SKIP_KW = re.compile(r"#shorts|開箱|unbox|review|評測|trailer|預告|\bCM\b|outfit|服裝|信賴度|比賽|fight night|highlights?|\bvs\b", re.I)
HARD_KW = re.compile(r"hiit|tabata|高強度|ハード|intense|爆汗|advanced|進階|no mercy", re.I)
LIGHT_KW = re.compile(r"beginner|初學|入門|輕|かるい|easy|low impact|stretch|伸展|ストレッチ", re.I)
MIN_KW = re.compile(r"(\d{1,2})\s*(?:-|~)?\s*(?:min|分鐘|分|minute)", re.I)

UA = {"User-Agent": "Mozilla/5.0 (boxing-app updater)", "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.8"}


def get(url, timeout=20):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def load_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def channel_of(video_id):
    html = get(f"https://www.youtube.com/watch?v={video_id}&hl=zh-TW")
    m = re.search(r'"channelId":"(UC[\w-]{22})"', html) or re.search(r'itemprop="channelId" content="(UC[\w-]{22})"', html)
    return m.group(1) if m else None


def classify(title, desc=""):
    text = f"{title} {desc}"
    src = "game" if GAME_KW.search(text) else "coach"
    intensity = "hard" if HARD_KW.search(title) else "light" if LIGHT_KW.search(title) else "normal"
    vtype = "stretch" if re.search(r"stretch|伸展|ストレッチ", title, re.I) and not re.search(r"box|拳|ボクシング", title, re.I) else "daily"
    m = MIN_KW.search(title)
    minutes = int(m.group(1)) if m and 3 <= int(m.group(1)) <= 90 else None
    return src, intensity, vtype, minutes


def from_rss(channel_id):
    xml = get(f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}")
    ns = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015", "media": "http://search.yahoo.com/mrss/"}
    root = ET.fromstring(xml)
    author = root.findtext("a:title", default="", namespaces=ns)
    out = []
    for e in root.findall("a:entry", ns):
        vid = e.findtext("yt:videoId", namespaces=ns)
        title = e.findtext("a:title", default="", namespaces=ns)
        pub = e.findtext("a:published", default="", namespaces=ns)
        desc = e.findtext("media:group/media:description", default="", namespaces=ns)
        out.append({"id": vid, "title": title, "published": pub[:10], "channel": author, "desc": desc[:300]})
    return out


def from_api(key):
    after = (datetime.now(timezone.utc) - timedelta(days=30)).strftime("%Y-%m-%dT%H:%M:%SZ")
    queries = ["健身拳擊 每日", "Fitness Boxing daily workout", "フィットボクシング デイリー", "拳擊有氧 跟練", "boxing workout follow along"]
    out = []
    for q in queries:
        params = urllib.parse.urlencode({"part": "snippet", "q": q, "type": "video", "videoEmbeddable": "true",
                                         "videoDuration": "medium", "order": "date", "publishedAfter": after,
                                         "maxResults": 15, "key": key})
        data = json.loads(get("https://www.googleapis.com/youtube/v3/search?" + params))
        for it in data.get("items", []):
            sn = it["snippet"]
            out.append({"id": it["id"]["videoId"], "title": sn["title"], "published": sn["publishedAt"][:10],
                        "channel": sn["channelTitle"], "desc": sn.get("description", "")[:300]})
    return out


def main():
    channels = load_json(CH_CACHE, {})
    for vid in SEED_VIDEOS:
        if vid in channels:
            continue
        try:
            cid = channel_of(vid)
            if cid:
                channels[vid] = cid
                print(f"channel {vid} -> {cid}")
        except Exception as ex:
            print(f"! 找不到 {vid} 的頻道：{ex}")
        time.sleep(1)
    os.makedirs(os.path.dirname(CH_CACHE), exist_ok=True)
    with open(CH_CACHE, "w", encoding="utf-8") as f:
        json.dump(channels, f, ensure_ascii=False, indent=1)

    found = []
    for cid in sorted(set(channels.values())):
        try:
            found += from_rss(cid)
        except Exception as ex:
            print(f"! RSS 失敗 {cid}：{ex}")
        time.sleep(0.5)
    key = os.environ.get("YOUTUBE_API_KEY", "").strip()
    if key:
        try:
            found += from_api(key)
        except Exception as ex:
            print(f"! API 搜尋失敗：{ex}")

    old = {v["id"]: v for v in load_json(OUT, {}).get("videos", [])}
    cutoff = (datetime.now(timezone.utc) - timedelta(days=KEEP_DAYS)).strftime("%Y-%m-%d")
    today = datetime.now(timezone(timedelta(hours=8))).strftime("%Y-%m-%d")
    merged = dict(old)
    for v in found:
        if not v.get("id") or v["id"] in merged:
            continue
        if not BOX_KW.search(v["title"] + " " + v.get("desc", "")) or SKIP_KW.search(v["title"]):
            continue
        src, intensity, vtype, minutes = classify(v["title"], v.get("desc", ""))
        merged[v["id"]] = {"id": v["id"], "title": v["title"][:80], "type": vtype, "int": intensity, "min": minutes,
                           "src": src, "channel": v.get("channel", ""), "published": v.get("published", ""), "added": today}
    vids = [v for v in merged.values() if (v.get("published") or v.get("added", "")) >= cutoff]
    vids.sort(key=lambda v: v.get("published", ""), reverse=True)
    vids = vids[:MAX_ITEMS]
    new_count = len([v for v in vids if v["id"] not in old])
    result = {"updated": datetime.now(timezone(timedelta(hours=8))).strftime("%Y-%m-%d %H:%M"), "videos": vids}
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=1)
    print(f"共 {len(vids)} 部，本次新增 {new_count} 部")


if __name__ == "__main__":
    sys.exit(main())
