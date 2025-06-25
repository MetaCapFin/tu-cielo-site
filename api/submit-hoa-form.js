const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

    const form = new formidable.IncomingForm({   
      keepExtensions: true,   
      uploadDir: "/tmp",
    });
  
    if (!file?.filepath) {
      console.error("Missing filepath for file:", file);
      return;
    }

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ error: "Form parsing failed" });
    }

    // Normalize field values
    const {
      hoaName,
      communityName,
      units,
      yearBuilt,
      contactName,
      position,
      email,
      phone,
      projectType,
      projectCost,
      loanAmount,
      loanTerm,
      monthlyDues,
      reserveBalance,
      annualBudget,
      delinquencyRate,
    } = Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
    );

    const boardId = 9191966932;
    const groupId = "group_title"; // Make sure this is your actual group ID
    const apiKey = process.env.MONDAY_API_KEY;

    const columnValues = {
      text_mkr4yxmr: communityName,     // Community Name
      numeric_mkr4ttda: Number(units) || 0,
      numeric_mkr4jp33: Number(yearBuilt) || 0,
      text_mkr42072: contactName,       // Contact Name
      text_mkr49z65: position,
      email_mkr4smcy: { email: email, text: email },
      phone_mkr46tp1: { phone: phone, countryShortName: "US" },
      text_mkr4c2tj: projectType,
      numeric_mkr4am8g: Number(projectCost?.replace(/[^0-9.-]+/g, "")) || 0,
      numeric_mkr4mpnr: Number(loanAmount?.replace(/[^0-9.-]+/g, "")) || 0,
      text_mkr4t75f: loanTerm,
      numeric_mkr4st1x: Number(monthlyDues?.replace(/[^0-9.-]+/g, "")) || 0,
      numeric_mkr4jrvy: Number(reserveBalance?.replace(/[^0-9.-]+/g, "")) || 0,
      numeric_mkr4h9qn: Number(annualBudget?.replace(/[^0-9.-]+/g, "")) || 0,
      numeric_mkr4j9bt: parseFloat(delinquencyRate?.replace(/[^0-9.]/g, "")) || 0,
    };

    const columnValuesString = JSON.stringify(columnValues)
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"');

    const query = `
      mutation {
        create_item (
          board_id: ${boardId},
          group_id: "${groupId}",
          item_name: "${hoaName}",
          column_values: "${columnValuesString}"
        ) {
          id
        }
      }
    `;

    try {
      const response = await fetch("https://api.monday.com/v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (data.errors || !data.data?.create_item?.id) {
        console.error("Monday API error:", data.errors);
        return res.status(500).json({ error: "Monday.com error", details: data.errors });
      }

      const itemId = data.data.create_item.id;

      // ==== Upload file(s) to Monday.com file columns ====

      const uploadFileToMonday = async (file, columnId) => {
        const form = new FormData();
        form.append(
          "query",
          `mutation ($file: File!) {
            add_file_to_column(item_id: ${itemId}, column_id: "${columnId}", file: $file) {
              id
            }
          }`
        );

        form.append("variables[file]", fs.createReadStream(file.filepath), file.originalFilename);

        try {
          const uploadResponse = await fetch("https://api.monday.com/v2/file", {
            method: "POST",
            headers: {
              Authorization: apiKey,
              ...form.getHeaders(),
            },
            body: form,
          });

          const uploadData = await uploadResponse.json();

          if (uploadData.errors) {
            console.error(`Error uploading to column "${columnId}":`, uploadData.errors);
          } else {
            console.log(`File uploaded successfully to column "${columnId}"`);
          }

        } catch (uploadErr) {
          console.error(`File upload error for column "${columnId}":`, uploadErr);
        }
      };

      // Upload both files (if they exist)
      if (files.reserveStudy) {
        await uploadFileToMonday(files.reserveStudy, "file_mkr4m54b"); // <-- replace with actual column ID
      }

      if (files.annualBudgetFile) {
        await uploadFileToMonday(files.annualBudgetFile, "file_mkr45fq2"); // <-- replace with actual column ID
      }

      res.status(200).json({ success: true, message: "Submitted successfully" });

    } catch (err) {
      console.error("Fetch error:", err);
      res.status(500).json({ error: "Server error during submission" });
    }
  });
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};

