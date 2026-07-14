// THE DEEP - feedback receiver (Google Apps Script)
// Receives feedback from the website and:
//   1. Files it as a Google Doc in your Drive: "The Deep — Feedback" / category / page /
//   2. Emails you immediately with the contents and a link to the Doc.
// Setup steps are in SETUP.md (same folder as this file).

var NOTIFY_EMAIL = "tim.hislop@gmail.com";
var ROOT_FOLDER = "The Deep — Feedback"; // "The Deep — Feedback" (em dash written safely)

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);

    // build folder path: ROOT / category / page
    var root = getOrCreateFolder_(DriveApp.getRootFolder(), ROOT_FOLDER);
    var cat = getOrCreateFolder_(root, sanitize_(d.category || "Other"));
    var page = getOrCreateFolder_(cat, sanitize_(d.page || "General"));

    // create the doc
    var stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
    var snippet = (d.message || d.quote || "(moods only)").substring(0, 40).replace(/\n/g, " ");
    var doc = DocumentApp.create(stamp + " - " + (d.who || "?") + " - " + snippet);
    var body = doc.getBody();
    body.appendParagraph("Feedback on: " + (d.pageTitle || d.page)).setHeading(DocumentApp.ParagraphHeading.HEADING2);
    body.appendParagraph("From: " + (d.who || "?") + "    When: " + stamp);
    if (d.moods && d.moods.length) body.appendParagraph("Mood: " + d.moods.join(", "));
    if (d.quote) {
      body.appendParagraph("The line it's about:").setHeading(DocumentApp.ParagraphHeading.HEADING4);
      body.appendParagraph('"' + d.quote + '"').setItalic(true);
    }
    if (d.message) {
      body.appendParagraph("Notes:").setHeading(DocumentApp.ParagraphHeading.HEADING4);
      body.appendParagraph(d.message);
    }
    body.appendParagraph("").appendText("Page: " + (d.url || "")).setFontSize(8);
    doc.saveAndClose();

    // move doc into the right folder
    var file = DriveApp.getFileById(doc.getId());
    page.addFile(file);
    DriveApp.getRootFolder().removeFile(file);

    // notify
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: "The Deep - feedback from " + (d.who || "?") + " on " + (d.pageTitle || d.page),
      body:
        "Page: " + (d.pageTitle || d.page) + "\n" +
        (d.moods && d.moods.length ? "Mood: " + d.moods.join(", ") + "\n" : "") +
        (d.quote ? 'Line: "' + d.quote + '"\n' : "") +
        (d.message ? "\n" + d.message + "\n" : "") +
        "\nDoc: " + doc.getUrl()
    });

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateFolder_(parent, name) {
  var it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

function sanitize_(s) {
  return String(s).replace(/[\\/:*?"<>|]/g, "-").substring(0, 60);
}
