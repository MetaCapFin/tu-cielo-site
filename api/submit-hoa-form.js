import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
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
      const groupId = "group_title"; // from your latest group lookup
      const apiKey = process.env.MONDAY_API_KEY;

      const columnValues = {
  text_mkr4yxmr: communityName,
  numeric_mkr4ttda: Number(units?.toString().replace(/[^0-9.]/g, "") || 0),
  numeric_mkr4jp33: Number(yearBuilt?.toString().replace(/[^0-9.]/g, "") || 0),
  text_mkr42072: contactName,
  text_mkr49z65: position,
  email_mkr4smcy: { email, text: email },
  phone_mkr46tp1: { phone, countryShortName: "US" },
  text_mkr4c2tj: projectType,
  numeric_mkr4am8g: Number(projectCost?.toString().replace(/[^0-9.]/g, "") || 0),
  numeric_mkr4mpnr: Number(loanAmount?.toString().replace(/[^0-9.]/g, "") || 0),
  text_mkr4t75f: loanTerm,
  numeric_mkr4st1x: Number(monthlyDues?.toString().replace(/[^0-9.]/g, "") || 0),
  numeric_mkr4jrvy: Number(reserveBalance?.toString().replace(/[^0-9.]/g, "") || 0),
  numeric_mkr4h9qn: Number(annualBudget?.toString().replace(/[^0-9.]/g, "") || 0),
  numeric_mkr4j9bt: parseFloat(delinquencyRate?.toString().replace(/[^0-9.]/g, "") || 0),
};

      const columnValuesStr = JSON.stringify(columnValues).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

      const query = `
        mutation {
          create_item (
            board_id: ${boardId},
            group_id: "${groupId}",
            item_name: "${hoaName}",
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

      if (data.errors) {
        console.error("Monday API error:", JSON.stringify(data.errors, null, 2));
        return res.status(500).json({ error: "Monday.com API error", details: data.errors });
      }

      return res.status(200).json({ success: true, message: "Submitted successfully" });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
}
