/**
 * Tidemark Advisory: intro-call requests -> Google Sheet + email.
 * Paste this into the Apps Script editor of the Google Sheet (Extensions > Apps Script),
 * then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 */
var NOTIFY_EMAIL = 'jason@tidemark.llc';
var SHEET_NAME = 'Requests';

function doPost(e) {
  var p = (e && e.parameter) || {};

  // Spam trap: real visitors never see or fill this hidden field.
  if (p.website) return ok_();

  var name = clean_(p.name, 120);
  var email = clean_(p.email, 200);
  var company = clean_(p.company, 160);
  var topic = clean_(p.topic, 2000);

  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return ok_();

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Received', 'Name', 'Email', 'Company', 'What to talk about']);
      sheet.setFrozenRows(1);
    }
    // A leading apostrophe stops a cell starting with = + - @ from running as a formula.
    sheet.appendRow([new Date(), safe_(name), safe_(email), safe_(company), safe_(topic)]);
  } finally {
    lock.releaseLock();
  }

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: email,
    subject: 'New intro call request: ' + name + (company ? ' (' + company + ')' : ''),
    body: 'Name: ' + name + '\nEmail: ' + email + '\nCompany: ' + company +
          '\n\nWhat they want to talk about:\n' + (topic || '(not given)')
  });

  return ok_();
}

function doGet() { return ok_(); }

function clean_(v, max) { return String(v || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max); }
function safe_(v) { return /^[=+\-@]/.test(v) ? "'" + v : v; }
function ok_() { return ContentService.createTextOutput('ok'); }
