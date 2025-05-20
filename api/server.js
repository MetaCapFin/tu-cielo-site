const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');

const upload = multer({ storage: multer.memoryStorage() });

const app = express();

const MONDAY_API_KEY = process.env.MONDAY_API_KEY;
const MONDAY_BOARD_ID = '9138987515';

const COLUMN_IDS = {
  name: 'text_mkqxc5rw',
  community: 'text_mkr0n693',
  city: 'text_mkqy7dse',
  role: 'text_mkqyp01b',
  budget: 'numeric_mkqxegkv',
  phone: 'phone_mkqxprbj',
  email: 'email_mkqxn7zz',
};

app.use(cors());
app.use(bodyParser.json());

// Contact form submission
app.post('/submit-form', async (req, res) => {
  const {
    name = '',
    community = '',
    city = '',
    role = '',
    budget = '',
    phone = '',
    email = ''
  } = req.body;

  const budgetNumber = Number(budget) || 0;

  const columnValues = {
    [COLUMN_IDS.name]: name,
    [COLUMN_IDS.community]: community,
    [COLUMN_IDS.city]: city,
    [COLUMN_IDS.role]: role,
    [COLUMN_IDS.budget]: budgetNumber,
    [COLUMN_IDS.phone]: { phone, countryShortName: "US" },
    [COLUMN_IDS.email]: { email, text: email }
  };

  const query = `
    mutation CreateItem($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
      create_item(
        board_id: $boardId,
        item_name: $itemName,
        column_values: $columnValues
      ) {
        id
      }
    }
  `;

  const variables = {
    boardId: MONDAY_BOARD_ID,
    itemName: name || 'New Contact',
    columnValues: JSON.stringify(columnValues),
  };

  try {
    const response = await axios.post(
      'https://api.monday.com/v2',
      { query, variables },
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

    res.status(200).json({
      success: true,
      itemId: response.data.data.create_item.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting form to Monday.com' });
  }
});

// HOA form submission with file upload
app.post(
  '/submit-hoa-form',
  upload.fields([
    { name: 'reserveStudy', maxCount: 1 },
    { name: 'annualBudgetFile', maxCount: 1 }
  ]),
  async (req, res) => {
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
        delinquencyRate
      } = req.body;

      const reserveStudy = req.files['reserveStudy']?.[0];
      const annualBudgetFile = req.files['annualBudgetFile']?.[0];

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
        delinquencyRate: 'numeric_mkr4j9bt'
      };

      const parseNumber = (val) => Number((val || '').replace(/[^\d.]/g, '')) || 0;

      const columnValues = {
        [HOA_COLUMN_IDS.hoaName]: hoaName,
        [HOA_COLUMN_IDS.communityName]: communityName,
        [HOA_COLUMN_IDS.units]: parseNumber(units),
        [HOA_COLUMN_IDS.yearBuilt]: parseNumber(yearBuilt),
        [HOA_COLUMN_IDS.contactName]: contactName,
        [HOA_COLUMN_IDS.position]: position,
        [HOA_COLUMN_IDS.email]: { email, text: email },
        [HOA_COLUMN_IDS.phone]: { phone, countryShortName: "US" },
        [HOA_COLUMN_IDS.projectType]: projectType,
        [HOA_COLUMN_IDS.projectCost]: parseNumber(projectCost),
        [HOA_COLUMN_IDS.loanAmount]: parseNumber(loanAmount),
        [HOA_COLUMN_IDS.loanTerm]: loanTerm,
        [HOA_COLUMN_IDS.monthlyDues]: parseNumber(monthlyDues),
        [HOA_COLUMN_IDS.reserveBalance]: parseNumber(reserveBalance),
        [HOA_COLUMN_IDS.annualBudget]: parseNumber(annualBudget),
        [HOA_COLUMN_IDS.delinquencyRate]: parseNumber(delinquencyRate)
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
            Authorization: MONDAY_API_KEY
          }
        }
      );

      if (response.data.errors) {
        return res.status(500).json({ error: response.data.errors });
      }

      const itemId = response.data.data.create_item.id;

      // Upload files to Monday.com
      const uploadFileToMonday = async (fileBuffer, fileName, columnId, itemId) => {
        const form = new FormData();

        form.append('query', `
          mutation addFile($file: File!) {
            add_file_to_column(
              file: $file,
              item_id: ${itemId},
              column_id: "${columnId}"
            ) {
              id
            }
          }
        `);

        form.append('variables', JSON.stringify({}));
        form.append('file', fileBuffer, {
          filename: fileName,
          contentType: 'application/octet-stream'
        });

        await axios.post('https://api.monday.com/v2/file', form, {
          headers: {
            ...form.getHeaders(),
            Authorization: MONDAY_API_KEY
          }
        });
      };

      if (reserveStudy) {
        await uploadFileToMonday(
          reserveStudy.buffer,
          reserveStudy.originalname,
          'files_mkr4a1px',
          itemId
        );
      }

      if (annualBudgetFile) {
        await uploadFileToMonday(
          annualBudgetFile.buffer,
          annualBudgetFile.originalname,
          'files_mkr4a4rw',
          itemId
        );
      }

      res.status(200).json({
        success: true,
        itemId
      });
    } catch (error) {
      console.error("❌ Failed to submit HOA form:", error.response?.data || error.message);
      res.status(500).json({ error: 'Submission to Monday.com failed.' });
    }
  }
);

module.exports = app;
