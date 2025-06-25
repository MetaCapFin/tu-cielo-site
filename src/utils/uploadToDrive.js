const fs = require("fs");
const { google } = require("googleapis");
const path = require("path");

/**
 * Uploads a file to Google Drive into the specified folder.
 * @param {Object} options
 * @param {string} options.filePath - Local path to the file (e.g. /tmp/abc.txt)
 * @param {string} options.originalFilename - Original file name (e.g. user-upload.txt)
 * @param {string} options.folderId - Google Drive folder ID
 * @param {string} [options.hoaName] - HOA Legal Name (for formatting)
 * @param {string} [options.communityName] - Community Name (for formatting)
 * @param {string} [options.label] - Either "Reserve Study" or "Annual Budget"
 */
async function uploadToDrive({ filePath, originalFilename, folderId, hoaName, communityName, label }) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    const ext = path.extname(originalFilename) || ".pdf";
    const formattedName =
      hoaName && communityName && label
        ? `${sanitize(hoaName)}_${sanitize(communityName)}_${label}${ext}`
        : originalFilename;

    const fileMetadata = {
      name: formattedName,
      parents: [folderId],
    };

    const media = {
      mimeType: getMimeType(originalFilename),
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, name, webViewLink",
    });

    return {
      id: response.data.id,
      name: response.data.name,
      url: response.data.webViewLink,
    };
  } catch (err) {
    console.error("Google Drive upload error:", err);
    throw err;
  }
}

function sanitize(str) {
  return str.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_").trim();
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const map = {
    ".pdf": "application/pdf",
    ".txt": "text/plain",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };
  return map[ext] || "application/octet-stream";
}

module.exports = uploadToDrive;

