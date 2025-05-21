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

  console.log("Fields:", fields); // DEBUG

  // Normalize fields safely:
  const normalizedFields = {};
  for (const key in fields) {
    const val = fields[key];
    normalizedFields[key] = Array.isArray(val) ? val[0] : val;
  }

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

  // ...rest of your code
});

    const boardId = 9191966932;
    const groupId = "group_title";
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

    // IMPORTANT: stringify AND escape quotes inside string for Monday.com
    const columnValuesString = JSON.stringify(columnValues)
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"');

    const query = `
      mutation {
        create_item(
          board_id: ${boardId},
          group_id: "${groupId}",
          item_name: "${hoaName} Loan App",
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
