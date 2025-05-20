import axios from 'axios';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false, // disable built-in body parser to use formidable
  },
};

const MONDAY_API_KEY = process.env.MONDAY_API_KEY;

const HOA_COLUMN_IDS = {
  hoaName: 'text_mkr42072',
  communityName: 'text_mkr4yxmr',
  units: 'numeric_mkr4ttda',
  yearBuilt: 'numeric_mkr4jp33',
  contactName: 'text_mkr42072',
  position: 'text_mkr49z65',
  email: 'email_mkr4smcy',
  phone: 'phone_mkr46tp1',
  projectType: 'text_mkr4c2tj',
  projectCost: 'numeric_mkr4am8g',
  loanAmount: 'numeric_mkr4mpnr',
  loanTerm: 'text_mkr4t75f',
  monthlyDues: 'numeric_mkr4st1x',
  reserveBalance: 'numeric_mkr4jrvy',
  annualBudget: 'numeric_mkr4h9qn',
  delinquencyRate: 'numeric_mkr4j9bt',
};

const FILE_COLUMN_IDS = {
  reserveStudy: 'files_mkr4a1px',
  annualBudgetFile: 'files_mkr4a4rw',
};

function parseNumber(val) {
  return Number((val || '').toString().replace(/[^\d.]/g, '')) || 0;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const form = new formidable.IncomingForm();
  form.multiples = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Error parsing form data' });
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

      const columnValues = {
        [HOA_COLUMN_IDS.hoaName]: hoaName,
        [HOA_COLUMN_IDS.communityName]: communityName,
        [HOA_COLUMN_IDS.units]: parseNumber(units),
        [HOA_COLUMN_IDS.yearBuilt]: parseNumber(yearBuilt),
        [HOA_COLUMN_IDS.contactName]: contactName,
        [HOA_COLUMN_IDS.position]: position,
        [HOA_COLUMN_IDS.email]: { email, text: email },
        [HOA_COLUMN_IDS.phone]: { phone, countryShortName: 'US' },
        [HOA_COLUMN_IDS.projectType]: projectType,
        [HOA_COLUMN_IDS.projectCost]: parseNumber(projectCost),
        [HOA_COLUMN_IDS.loanAmount]: parseNumber(loanAmount),
        [HOA_COLUMN_IDS.loanTerm]: loanTerm,
        [HOA_COLUMN_IDS.monthlyDues]: parseNumber(monthlyDues),
        [HOA_COLUMN_IDS.reserveBalance]: parseNumber(reserveBalance),
        [HOA_COLUMN_IDS.annualBudget]: parseNumber(annualBudget),
        [HOA_COLUMN_IDS.delinquencyRate]: parseNumber(delinquencyRate),
      };

      const columnValuesStr = JSON.stringify(columnValues).replace(/"/g, '\\"');

      const query = `
        mutation {
          create_item(
            board_id: 9191966932,
            item_name: "${hoaName || 'HOA Submission'}",
            column_values: "${columnValuesStr}"
          ) {
            id
          }
        }
      `;

      const response = await axios.post(
        'https://api.monday.com/v2',
        { query },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: MONDAY_API_KEY,
          },
        }
      );

      if (response.data.errors) {
        return res.status(500).json({ error: response.data.errors });
      }

      const itemId = response.data.data.create_item.id;

      // Helper to upload file buffer to Monday.com
      const uploadFileToMonday = async (filePath, fileName, columnId) => {
        const fs = require('fs');
        const FormData = require('form-data');

        const form = new FormData();
        form.append(
          'query',
          `
          mutation addFile($file: File!) {
            add_file_to_column(
              file: $file,
              item_id: ${itemId},
              column_id: "${columnId}"
            ) {
              id
            }
          }
        `
        );
        form.append('variables', JSON.stringify({}));
        form.append('file', fs.createReadStream(filePath), {
          filename: fileName,
          contentType: 'application/octet-stream',
        });

        await axios.post('https://api.monday.com/v2/file', form, {
          headers: {
            ...form.getHeaders(),
            Authorization: MONDAY_API_KEY,
          },
        });
      };

      // Upload files if present
      if (files.reserveStudy) {
        await uploadFileToMonday(files.reserveStudy.filepath, files.reserveStudy.originalFilename, FILE_COLUMN_IDS.reserveStudy);
      }

      if (files.annualBudgetFile) {
        await uploadFileToMonday(files.annualBudgetFile.filepath, files.annualBudgetFile.originalFilename, FILE_COLUMN_IDS.annualBudgetFile);
      }

      res.status(200).json({ success: true, itemId });
    } catch (error) {
      console.error('❌ Failed to submit HOA form:', error.response?.data || error.message);
      res.status(500).json({ error: 'Submission to Monday.com failed.' });
    }
  });
}
