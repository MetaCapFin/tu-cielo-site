import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, // disable built-in parser to use formidable
  },
};

const MONDAY_API = "https://api.monday.com/v2";
const API_KEY = process.env.MONDAY_API_KEY;
const BOARD_ID = "9191966932";
const GROUP_ID = "topics"; // replace with your actual group ID or omit for default

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Parse form with formidable (fields + files)
  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable parse error:", err);
      return res.status(500).json({ error: "Form parse failed" });
    }

    try {
      // Normalize fields (if any are arrays, pick first value)
      const normalizedFields = {};
      for (const key in fields) {
        normalizedFields[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
      }

      // Prepare columnValues object with your mapped fields here
      // Example: map your form fields to Monday column IDs
      const columnValues = {
        text_mkqxaajc: normalizedFields.communityName || "",
        text_mkqxc5rw: normalizedFields.hoaName || "",
        numeric_mkqxegkv: Number((normalizedFields.projectCost || "0").replace(/[^0-9.-]+/g, "")),
        phone_mkqxprbj: { phone: normalizedFields.phone || "", countryShortName: "US" },
        email_mkqxn7zz: { email: normalizedFields.email || "", text: normalizedFields.email || "" },
        text_mkqyp01b: normalizedFields.position || "",
        text_mkqy7dse: Number(normalizedFields.units) || 0,
        numbers8: Number(normalizedFields.yearBuilt) || 0,
        text9: normalizedFields.contactName || "",
        text1__1: normalizedFields.projectType || "",
        numbers6: Number((normalizedFields.loanAmount || "0").replace(/[^0-9.-]+/g, "")),
        dropdown4: { labels: [normalizedFields.loanTerm] || [] },
        numbers1: Number((normalizedFields.monthlyDues || "0").replace(/[^0-9.-]+/g, "")),
        numbers2: Number((normalizedFields.reserveBalance || "0").replace(/[^0-9.-]+/g, "")),
        numbers3: Number((normalizedFields.annualBudget || "0").replace(/[^0-9.-]+/g, "")),
        numbers4: parseFloat((normalizedFields.delinquencyRate || "0").replace(/[^0-9.]/g, "")),
      };

      // 1) Create the item on Monday with column values
      const createItemQuery = `
        mutation CreateItem($boardId: ID!, $groupId: String!, $itemName: String!, $columnValues: JSON!) {
          create_item(board_id: $boardId, group_id: $groupId, item_name: $itemName, column_values: $columnValues) {
            id
          }
        }
      `;

      const createItemVars = {
        boardId: BOARD_ID,
        groupId: GROUP_ID,
        itemName: `${normalizedFields.hoaName || "HOA"} Loan Application`,
        columnValues: JSON.stringify(columnValues),
      };

      const createRes = await fetch(MONDAY_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: API_KEY,
        },
        body: JSON.stringify({ query: createItemQuery, variables: createItemVars }),
      });

      const createData = await createRes.json();

      if (createData.errors) {
        console.error("Monday create item error:", createData.errors);
        return res.status(500).json({ error: "Monday create item failed", details: createData.errors });
      }

      const itemId = createData.data.create_item.id;

      // 2) Upload files (if any)
      if (files && Object.keys(files).length > 0) {
        for (const fileKey of Object.keys(files)) {
          const file = files[fileKey];

          // Read file buffer (assuming single file per field)
          const fileBuffer = await fsReadFile(file.filepath);

          // Upload file using Monday's add_file_to_column mutation
          // Note: Monday requires multipart request to upload file binary + variables
          const formData = new FormData();
          formData.append("query", `
            mutation ($file: Upload!, $itemId: Int!, $columnId: String!) {
              add_file_to_column (item_id: $itemId, column_id: $columnId, file: $file) {
                id
              }
            }
          `);
          formData.append("variables", JSON.stringify({
            itemId: parseInt(itemId, 10),
            columnId: "your_file_column_id", // replace with your actual file column ID
          }));
          formData.append("file", new Blob([fileBuffer]), file.originalFilename);

          const uploadRes = await fetch(MONDAY_API, {
            method: "POST",
            headers: {
              Authorization: API_KEY,
            },
            body: formData,
          });

          const uploadData = await uploadRes.json();

          if (uploadData.errors) {
            console.error("Monday file upload error:", uploadData.errors);
            return res.status(500).json({ error: "Monday file upload failed", details: uploadData.errors });
          }
        }
      }

      // Success
      return res.status(200).json({ success: true, itemId });
    } catch (error) {
      console.error("Submission error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}

// Helper function to read file to buffer (Node.js)
import fs from "fs";
function fsReadFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
