import formidable from "formidable";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false,
  },
};

const mondayApi = axios.create({
  baseURL: "https://api.monday.com/v2",
  headers: {
    Authorization: process.env.MONDAY_API_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ message: "File parsing failed." });
    }

    try {
      const boardId = 9191966932;

      const getInt = (val) => parseInt(val?.toString().replace(/\D/g, "")) || null;
      const getFloat = (val) => parseFloat(val?.toString().replace(/[^\d.]/g, "")) || null;

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

      // Create Monday.com item
      const itemResponse = await mondayApi.post("/items.json", {
        board_id: boardId,
        item_name: itemName,
        column_values: JSON.stringify(column_values),
      });

      const itemId = itemResponse.data.data.id;

      const uploadFile = async (columnId, file) => {
        const formData = new FormData();

        const operations = {
          query: `
            mutation ($file: Upload!, $itemId: Int!, $columnId: String!) {
              add_file_to_column(file: $file, item_id: $itemId, column_id: $columnId) {
                id
              }
            }
          `,
          variables: {
            file: null,
            itemId,
            columnId,
          },
        };

        const map = { "0": ["variables.file"] };

        formData.append("operations", JSON.stringify(operations));
        formData.append("map", JSON.stringify(map));
        formData.append("0", fs.createReadStream(file.filepath), file.originalFilename || "upload.file");

        const res = await mondayApi.post("/", formData, {
          headers: formData.getHeaders(),
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });

        return res.data;
      };

      if (files.reserveStudy) {
        await uploadFile("file_mkr4m54b", files.reserveStudy);
      }

      if (files.annualBudgetFile) {
        await uploadFile("file_mkr45fq2", files.annualBudgetFile);
      }

      return res.status(200).json({ success: true, itemId });
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      return res.status(500).json({ success: false, message: "Submission failed." });
    }
  });
}
