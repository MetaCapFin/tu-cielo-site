const express = require("express");
const next = require("next");
const formidable = require("formidable");
const fs = require("fs");
const cors = require("cors");
const { createItem } = require("./mondayService");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

require("dotenv").config();

app.prepare().then(() => {
  const server = express();
  server.use(cors());

  server.post("/api/submit-hoa-form", (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Formidable error:", err);
        return res.status(500).json({ success: false, error: "Form parse error" });
      }

      try {
        const columnValues = {
          text9: fields.hoaName,
          text8: fields.communityName,
          numbers2: fields.units,
          numbers: fields.yearBuilt,
          text4: fields.contactName,
          dropdown: { labels: [fields.position] },
          email: { email: fields.email, text: fields.email },
          phone: { phone: fields.phone, countryShortName: "us" },
          text7: fields.projectType,
          numbers4: fields.projectCost,
          numbers3: fields.loanAmount,
          dropdown4: { labels: [fields.loanTerm] },
          numbers6: fields.monthlyDues,
          numbers5: fields.reserveBalance,
          numbers8: fields.annualBudget,
          numbers7: fields.delinquencyRate?.replace("%", "")
        };

        await createItem(process.env.HOA_BOARD_ID, fields.hoaName, columnValues);
        res.status(200).json({ success: true });
      } catch (err) {
        console.error("Submission failed:", err);
        res.status(500).json({ success: false, error: "Submission error" });
      }
    });
  });

  server.all("*", (req, res) => handle(req, res));
  const port = parseInt(process.env.PORT, 10) || 3000;
  server.listen(port, () => console.log(`> Ready on http://localhost:${port}`));
});

