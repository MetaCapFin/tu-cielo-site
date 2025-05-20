import axios from 'axios';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name = '', community = '', city = '', role = '', budget = '', phone = '', email = '' } = req.body;

  const budgetNumber = Number(budget) || 0;

  const columnValues = {
    [COLUMN_IDS.name]: name,
    [COLUMN_IDS.community]: community,
    [COLUMN_IDS.city]: city,
    [COLUMN_IDS.role]: role,
    [COLUMN_IDS.budget]: budgetNumber,
    [COLUMN_IDS.phone]: { phone, countryShortName: 'US' },
    [COLUMN_IDS.email]: { email, text: email },
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
      itemId: response.data.data.create_item.id,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting form to Monday.com' });
  }
}
