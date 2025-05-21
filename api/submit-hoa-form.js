const formidable = require("formidable");
const fetch = require("node-fetch");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ error: "Form parsing failed" });
    }

    // Normalize fields: unwrap arrays if present
    const normalizedFields = {};
    for (const key in fields) {
      const val = fields[key];
      normalizedFields[key] = Array.isArray(val) ? val[0] : val;
    }

    // Destructure form fields
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
    } = normalizedFields;

    // Monday.com API config
    const boardId = "9191966932"; // String
    const groupId = "group_title"; // Make sure this matches your board's group ID
    const apiKey = process.env.MONDAY_API_KEY;

    // Construct columnValues as a JS object first
    const columnValuesObj = {
      text_mkqxaajc: communityName || "",
      text_mkqxc5rw: hoaName || "",
      numeric_mkqxegkv: Number(projectCost?.replace(/[^0-9.-]+/g, "")) || 0,
      phone_mkqxprbj: { phone: phone || "", countryShortName: "US" },
      email_mkqxn7zz: { email: email || "", text: email || "" },
      text_mkqyp01b: position || "",
      text_mkqy7dse: Number(units) || 0,
      numbers8: Number(yearBuilt) || 0,
      text9: contactName || "",
      text1__1: projectType || "",
      numbers6: Number(loanAmount?.replace(/[^0-9.-]+/g, "")) || 0,
      dropdown4: { labels: [loanTerm] || [] },
      numbers1: Number(monthlyDues?.replace(/[^0-9.-]+/g, "")) || 0,
      numbers2: Number(reserveBalance?.replace(/[^0-9.-]+/g, "")) || 0,
      numbers3: Number(annualBudget?.replace(/[^0-9.-]+/g, "")) || 0,
      numbers4: parseFloat(delinquencyRate?.replace(/[^0-9.]/g, "")) || 0,
    };

    // Monday.com expects the column_values field as a JSON string
    const columnValues = JSON.stringify(columnValuesObj);

    // GraphQL mutation query string — no JS template literals inside the string
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

    // Variables for the mutation
    const variables = {
      boardId,
      groupId,
      itemName: `${hoaName || "HOA"} Loan App`,
      columnValues,
    };

    try {
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

      res.status(200).json({ success: true, message: "Form submitted successfully", itemId: data.data.create_item.id });
    } catch (err) {
      console.error("Fetch error:", err);
      res.status(500).json({ error: "Server error during submission" });
    }
  });
};

// Disable bodyParser for formidable
module.exports.config = {
  api: {
    bodyParser: false,
  },
};


