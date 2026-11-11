/**
 * 拳擊跟練：Google 雲端硬碟備份
 * 放進 https://script.google.com 新專案，部署成「網頁應用程式」使用。
 *
 * 1. 把下面的 SECRET 改成你自己想的密碼（App 設定時要填一樣的）
 * 2. 部署 → 新增部署作業 → 類型選「網頁應用程式」
 *    執行身分：我　／　誰可以存取：所有人
 * 3. 複製「網頁應用程式網址」貼到 App 的「紀錄 → Google 雲端備份」
 */
const SECRET = '請改成你自己的密碼';
const FOLDER_NAME = '拳擊跟練備份';
const LATEST = '最新備份.json';
const KEEP_DAYS = 30;   // 每日快照保留天數

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.key !== SECRET) return out({ ok: false, error: '密碼不正確' });
    const folder = getFolder_();

    if (body.action === 'ping') return out({ ok: true });

    if (body.action === 'save') {
      const text = JSON.stringify(body.data);
      upsert_(folder, LATEST, text);
      const day = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd');
      upsert_(folder, '快照-' + day + '.json', text);   // 每天一份，同一天覆蓋
      prune_(folder);
      return out({ ok: true, saved: new Date().toISOString() });
    }

    if (body.action === 'load') {
      const it = folder.getFilesByName(LATEST);
      if (!it.hasNext()) return out({ ok: false, error: '雲端還沒有備份' });
      const f = it.next();
      return out({ ok: true, data: JSON.parse(f.getBlob().getDataAsString('UTF-8')), saved: f.getLastUpdated().toISOString() });
    }
    return out({ ok: false, error: '未知的動作' });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function doGet() {
  return out({ ok: true, msg: '拳擊跟練備份服務運作中' });
}

function getFolder_() {
  const it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}

function upsert_(folder, name, text) {
  const it = folder.getFilesByName(name);
  if (it.hasNext()) it.next().setContent(text);
  else folder.createFile(name, text, 'application/json');
}

function prune_(folder) {
  const cutoff = Utilities.formatDate(new Date(Date.now() - KEEP_DAYS * 864e5), 'Asia/Taipei', 'yyyy-MM-dd');
  const it = folder.getFiles();
  while (it.hasNext()) {
    const f = it.next();
    const m = f.getName().match(/^快照-(\d{4}-\d{2}-\d{2})\.json$/);
    if (m && m[1] < cutoff) f.setTrashed(true);
  }
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
