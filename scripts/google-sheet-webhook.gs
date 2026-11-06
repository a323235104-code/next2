/**
 * 알림받기 신청 → 구글 스프레드시트 자동 저장 (Google Apps Script)
 *
 * [설치 방법]
 * 1. 구글 스프레드시트를 새로 만듭니다. (예: "A2O LITE × 동백마을 알림신청")
 * 2. 메뉴 [확장 프로그램] → [Apps Script] 를 엽니다.
 * 3. 기본 코드(Code.gs)를 모두 지우고 이 파일 내용을 그대로 붙여 넣습니다.
 * 4. 아래 TOKEN 값을 아무도 모르는 긴 문자열로 바꿉니다.
 *    → 같은 값을 사이트의 GOOGLE_SHEET_TOKEN 환경변수에도 넣습니다.
 * 5. [배포] → [새 배포] → 유형: [웹 앱]
 *      - 다음 사용자로 실행: 나
 *      - 액세스 권한이 있는 사용자: 모든 사용자
 *    → [배포] 후 권한 허용 → 나오는 "웹 앱 URL"을 복사합니다.
 *    → 이 URL을 사이트의 GOOGLE_SHEET_WEBHOOK_URL 환경변수에 넣습니다.
 *
 * ※ 코드를 고친 뒤에는 [배포] → [배포 관리] → 연필(수정) → 버전 "새 버전" → [배포] 해야 반영됩니다.
 */

const TOKEN = '여기에-아무도-모르는-긴-문자열을-넣으세요';
const SHEET_NAME = '알림신청';
const HEADER = ['신청일시', '휴대폰 번호', '카카오톡', '문자', '개인정보 수집·이용 동의', '광고성 정보 수신 동의'];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.token !== TOKEN) return json_({ ok: false, error: 'unauthorized' });

    const phone = String(data.phone || '');
    if (!/^01[016789]-\d{3,4}-\d{4}$/.test(phone)) return json_({ ok: false, error: 'invalid_phone' });

    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);

    // 동시에 여러 명이 신청해도 줄이 꼬이지 않게 잠금
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(HEADER);
        sheet.setFrozenRows(1);
        sheet.getRange('B:B').setNumberFormat('@'); // 번호 앞 0이 사라지지 않게 '글자'로 저장
      }

      // 같은 번호가 이미 있으면 다시 넣지 않음
      const last = sheet.getLastRow();
      if (last > 1) {
        const phones = sheet.getRange(2, 2, last - 1, 1).getDisplayValues().map(function (r) { return r[0]; });
        if (phones.indexOf(phone) !== -1) return json_({ ok: true, duplicate: true });
      }

      sheet.appendRow([
        new Date(),
        phone,
        data.kakao ? 'O' : '',
        data.sms ? 'O' : '',
        data.privacy ? '동의' : '',
        data.marketing ? '동의' : '',
      ]);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: 'server_error' });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
