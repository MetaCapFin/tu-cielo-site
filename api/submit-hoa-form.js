const formidable = require("formidable");

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
    const groupId = "group_title";  // Make sure this is your actual group ID
    const apiKey = process.env.MONDAY_API_KEY;

    // Prepare Monday.com column values object WITHOUT hoaName (used as item_name)
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

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
