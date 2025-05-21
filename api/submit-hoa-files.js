const formidable = require("formidable");

// Disable default body parsing for this route
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Parse only files from the multipart form data
  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable parse error:", err);
      return res.status(500).json({ error: "File parsing failed" });
    }

    try {
      // Here, `fields` contains your text inputs as strings,
      // and `files` contains your uploaded files

      // Example: extract fields you expect
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
      } = fields;

      // You can process uploaded files here as needed
      // Example: files.myUploadedFile

      const boardId = "9191966932";
      const groupId = "group_title"; // replace with your actual group id
      const apiKey = process.env.MONDAY_API_KEY;

      const columnValues = {
        text_mkqxaajc: communityName,
        text_mkqxc5rw: hoaName,
        numeric_mkqxegkv: Number(projectCost?.replace(/[^0-9.-]+/g, "")) || 0,
        phone_mkqxprbj: { phone: phone, countryShortName: "US" },
        email_mkqxn7zz: { email: email, text: email },
        text_mkqyp01b: position,
        text_mkqy7dse: Number(units),
        numbers8: Number(yearBuilt),
        text9: contactName,
        text1__1: projectType,
        numbers6: Number(loanAmount?.replace(/[^0-9.-]+/g, "")) || 0,
        dropdown4: { labels: [loanTerm] },
        numbers1: Number(monthlyDues?.replace(/[^0-9.-]+/g, "")) || 0,
        numbers2: Number(reserveBalance?.replace(/[^0-9.-]+/g, "")) || 0,
        numbers3: Number(annualBudget?.replace(/[^0-9.-]+/g, "")) || 0,
        numbers4: parseFloat(delinquencyRate?.replace(/[^0-9.]/g, "")) || 0,
      };

      const query = `
        mutation CreateItem($boardId: ID!, $groupId: String!, $itemName: String!, $columnValues: JSON!) {
          create_item(
            board_id: $boardId,
            group_id: $groupId,
            item_name: $itemName,
            column_values: $columnValues
          ) {
            id
          }
        }
      `;

      const variables = {
        boardId,
        groupId,
        itemName: `${hoaName} Loan App`,
        columnValues: JSON.stringify(columnValues),
      };

      const response = await fetch("https://api.monday.com/v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({ query, variables }),
      });

      const data = await response.json();

      if (data.errors) {
        console.error("Monday API error:", data.errors);
        return res.status(500).json({ error: "Monday.com error", details: data.errors });
      }

      // If you want to handle file uploads to Monday.com (like file columns),
      // you’ll need to upload files separately with their upload API and get file URLs or asset IDs.

      res.status(200).json({ success: true, message: "Form and files submitted successfully" });
    } catch (error) {
      console.error("Submission error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};
