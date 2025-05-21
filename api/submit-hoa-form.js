const formidable = require("formidable");
const fetch = require("node-fetch"); // if your Node.js version <18, install node-fetch

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ error: "Form parsing failed" });
    }

    // Normalize fields: if any field comes as array, take first element
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
      Object.entries(fields).map(([key, value]) =>
        Array.isArray(value) ? [key, value[0]] : [key, value]
      )
    );

    const boardId = 9191966932;
    const groupId = "group_title";
    const apiKey = process.env.MONDAY_API_KEY;

    // Prepare Monday.com column values according to your column IDs and formatting needs
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

    // Monday.com GraphQL mutation with variables (recommended)
    const query = `
      mutation CreateItem($boardId: Int!, $groupId: String!, $itemName: String!, $columnValues: JSON!) {
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

      res.status(200).json({ success: true, message: "Submitted successfully" });
    } catch (err) {
      console.error("Fetch error:", err);
      res.status(500).json({ error: "Server error during submission" });
    }
  });
};

// Disable body parsing by Next.js (required for formidable)
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

