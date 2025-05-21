import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,  // Disable Next.js default parser to handle multipart/form-data with formidable
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm({ keepExtensions: true }); // Keep file extensions if files uploaded

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ error: "Form parsing failed" });
    }

    // Destructure form fields from the parsed form data
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

    // Monday.com board and group info
    const boardId = 9191966932;  // Your board ID
    const groupId = "group_title"; // Your group ID from Monday.com API response
    const apiKey = process.env.MONDAY_API_KEY; // Monday.com API key from environment variables

    // Prepare the column values object for Monday.com
    // All keys use the exact column IDs you provided
    // Convert string numbers to actual numbers and clean currency strings
    const columnValues = {
      text_mkr42072: hoaName || "",
      text_mkr4yxmr: communityName || "",
      numeric_mkr4ttda: Number(units) || 0,
      numeric_mkr4jp33: Number(yearBuilt) || 0,
      text_mkr42072: contactName || "", // WARNING: Check this again if this is really the correct column for contactName; this ID duplicates hoaName's!
      text_mkr49z65: { labels: [position] }, // Dropdown: must be an object with labels array
      email_mkr4smcy: { email: email || "", text: email || "" },
      phone_mkr46tp1: { phone: phone || "", countryShortName: "US" },
      text_mkr4c2tj: projectType || "",
      numeric_mkr4am8g: Number(projectCost?.toString().replace(/[^0-9.-]+/g, "")) || 0,
      numeric_mkr4mpnr: Number(loanAmount?.toString().replace(/[^0-9.-]+/g, "")) || 0,
      text_mkr4t75f: { labels: [loanTerm] }, // Dropdown: loanTerm
      numeric_mkr4st1x: Number(monthlyDues?.toString().replace(/[^0-9.-]+/g, "")) || 0,
      numeric_mkr4jrvy: Number(reserveBalance?.toString().replace(/[^0-9.-]+/g, "")) || 0,
      numeric_mkr4h9qn: Number(annualBudget?.toString().replace(/[^0-9.-]+/g, "")) || 0,
      numeric_mkr4j9bt: parseFloat(delinquencyRate?.toString().replace(/[^0-9.]/g, "")) || 0,
    };

    // JSON stringify column values for the mutation, and escape quotes properly
    const columnValuesStr = JSON.stringify(columnValues);

    // Construct the GraphQL mutation for Monday.com
    const query = `
      mutation {
        create_item(
          board_id: ${boardId},
          group_id: "${groupId}",
          item_name: "${hoaName || "New HOA Loan Application"}",
          column_values: ${JSON.stringify(columnValuesStr)}
        ) {
          id
        }
      }
    `;

    try {
      // Send request to Monday.com GraphQL API
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
        return res.status(500).json({ error: "Monday.com API error", details: data.errors });
      }

      // Success response
      return res.status(200).json({ success: true, message: "Submitted successfully" });
    } catch (error) {
      console.error("Fetch error:", error);
      return res.status(500).json({ error: "Server error during submission" });
    }
  });
}

