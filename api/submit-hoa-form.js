import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false, // Important for formidable
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Failed to parse form data." });
    }

    try {
      const boardId = 9191966932;
      const groupId = "group_title"; // Replace with your actual group ID if needed

      // Helper functions to parse numbers safely
      const getInt = (val) => parseInt(val?.toString().replace(/\D/g, "")) || null;
      const getFloat = (val) => parseFloat(val?.toString().replace(/[^\d.]/g, "")) || null;

      // Prepare column values object
      const column_values = {
        text_mkr42072: fields.hoaName,
        text_mkr4yxmr: fields.communityName,
        numeric_mkr4ttda: getInt(fields.units),
        numeric_mkr4jp33: getInt(fields.yearBuilt),
        text_mkr49z65: fields.position,
        email_mkr4smcy: { email: fields.email, text: fields.email },
        phone_mkr46tp1: fields.phone,
        text_mkr4c2tj: fields.projectType,
        numeric_mkr4am8g: getInt(fields.projectCost),
        numeric_mkr4mpnr: getInt(fields.loanAmount),
        text_mkr4t75f: fields.loanTerm,
        numeric_mkr4st1x: getInt(fields.monthlyDues),
        numeric_mkr4jrvy: getInt(fields.reserveBalance),
        numeric_mkr4h9qn: getInt(fields.annualBudget),
        numeric_mkr4j9bt: getFloat(fields.delinquencyRate),
      };

      const itemName = `HOA App: ${fields.communityName || "New Submission"}`;

      // GraphQL mutation for creating item
      const createItemMutation = `
        mutation ($boardId: Int!, $groupId: String!, $itemName: String!, $columnValues: JSON!) {
          create_item(board_id: $boardId, group_id: $groupId, item_name: $itemName, column_values: $columnValues) {
            id
          }
        }
      `;

      // Create item in Monday.com
      const createItemResponse = await fetch("https://api.monday.com/v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.MONDAY_API_KEY,
        },
        body: JSON.stringify({
          query: createItemMutation,
          variables: {
            boardId,
            groupId,
            itemName,
            columnValues: column_values,
          },
        }),
      });

      const createItemData = await createItemResponse.json();

      if (createItemData.errors) {
        console.error("Monday API item creation errors:", createItemData.errors);
        return res.status(500).json({ error: "Failed to create item in Monday.com" });
      }

      const itemId = createItemData.data.create_item.id;

      // Helper to upload file to Monday.com column
      const uploadFile = async (columnId, file) => {
        const formData = new FormData();

        const operations = JSON.stringify({
          query: `
            mutation ($file: File!, $itemId: Int!, $columnId: String!) {
              add_file_to_column(file: $file, item_id: $itemId, column_id: $columnId) {
                id
              }
            }
          `,
          variables: { file: null, itemId, columnId },
        });

        const map = JSON.stringify({ "0": ["variables.file"] });

        formData.append("operations", operations);
        formData.append("map", map);
        formData.append("0", fs.createReadStream(file.filepath));

        const uploadRes = await fetch("https://api.monday.com/v2", {
          method: "POST",
          headers: {
            Authorization: process.env.MONDAY_API_KEY,
          },
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (uploadData.errors) {
          throw new Error(`File upload error: ${JSON.stringify(uploadData.errors)}`);
        }
      };

      // Upload files if they exist
      if (files.reserveStudy) {
        await uploadFile("file_mkr4m54b", files.reserveStudy);
      }
      if (files.annualBudgetFile) {
        await uploadFile("file_mkr45fq2", files.annualBudgetFile);
      }

      return res.status(200).json({ success: true, itemId });
    } catch (error) {
      console.error("Submission error:", error);
      return res.status(500).json({ error: "Submission failed." });
    }
  });
}
