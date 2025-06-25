const fs = require("fs");
const { google } = require("googleapis");
const path = require("path");

/**
 * Uploads a file to Google Drive into the specified folder.
 * @param {Object} options
 * @param {string} options.filePath - Local path to the file (e.g. /tmp/abc.txt)
 * @param {string} options.originalFilename - Original file name (e.g. user-upload.txt)
 * @param {string} options.folderId - Google Drive folder ID
 */
async function uploadToDrive({ filePath, originalFilename, folderId }) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    const fileMetadata = {
      name: originalFilename,
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
