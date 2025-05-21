import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ error: "Form parsing failed" });
    }

    try {
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

      const boardId = 9191966932;
      const groupId = "group_title";
      const apiKey = process.env.MONDAY_API_KEY;

      const columnValues = {
        text_mkr4yxmr: communityName || "", // Community Name
        numeric_mkr4ttda: Number(units) || 0, // Number of Units
        numeric_mkr4jp33: Number(yearBuilt) || 0, // Year Built
        text_mkr42072: contactName || "", // Contact Name
        text_mkr49z65: position || "", // Position (text)
        email_mkr4smcy: JSON.stringify({ email, text: email }), // Email
        phone_mkr46tp1: JSON.stringify({ phone, countryShortName: "US" }), // Phone
        text_mkr4c2tj: projectType || "", // Project Type
        numeric_mkr4am8g: parseFloat(projectCost?.toString().replace(/[^0-9.-]+/g, "")) || 0, // Estimated Project Cost
        numeric_mkr4mpnr: parseFloat(loanAmount?.toString().replace(/[^0-9.-]+/g, "")) || 0, // Loan Amount
        text_mkr4t75f: loanTerm || "", // Loan Term (text)
        numeric_mkr4st1x: parseFloat(monthlyDues?.toString().replace(/[^0-9.-]+/g, "")) || 0, // Monthly Dues
        numeric_mkr4jrvy: parseFloat(reserveBalance?.toString().replace(/[^0-9.-]+/g, "")) || 0, // Reserve Balance
        numeric_mkr4h9qn: parseFloat(annualBudget?.toString().replace(/[^0-9.-]+/g, "")) || 0, // Annual Budget
        numeric_mkr4j9bt: parseFloat(delinquencyRate?.toString().replace(/[^0-9.]/g, "")) || 0, // Delinquency Rate
      };

      // Remove undefined/null values
      Object.keys(columnValues).forEach(
        (key) => columnValues[key] === null || columnValues[key] === undefined
          ? delete columnValues[key]
          : null
      );

      const columnValuesStr = JSON.stringify(columnValues).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      const itemName = hoaName ? hoaName.replace(/"/g, '\\"') : "HOA Loan Application";

      const query = `
        mutation {
          create_item (
            board_id: ${boardId},
            group_id: "${groupId}",
            item_name: "${itemName}",
            column_values: "${columnValuesStr}"
          ) {
            id
          }
        }
      `;

      const response = await fetch("https://api.monday.com/v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      console.log("Monday API Response:", JSON.stringify(data, null, 2));

      if (data.errors) {
        return res.status(500).json({ error: "Monday.com error", details: data.errors });
      }

      res.status(200).json({ success: true, message: "Submitted successfully" });
    } catch (error) {
      console.error("Unexpected server error:", error);
      res.status(500).json({ error: "Unexpected error", message: error.message });
    }
  });
}
