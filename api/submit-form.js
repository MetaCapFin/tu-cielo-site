import axios from 'axios';

const MONDAY_API_KEY = process.env.MONDAY_API_KEY;

const COLUMN_IDS = {
  name: 'text_mkqxc5rw',
  community: 'text_mkqxaajc',
  city: 'text_mkqy7dse',
  role: 'text_mkqyp01b',
  budget: 'numeric_mkqxegkv',
  email: 'email_mkqxn7zz',
  phone: 'phone_mkqxprbj',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, community, city, role, budget, email, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    const columnValues = {
      [COLUMN_IDS.name]: name,
      [COLUMN_IDS.community]: community || '',
      [COLUMN_IDS.city]: city || '',
      [COLUMN_IDS.role]: role || '',
      [COLUMN_IDS.budget]: Number(budget) || 0,
      [COLUMN_IDS.email]: { email, text: email },
      [COLUMN_IDS.phone]: { phone: phone || '', countryShortName: 'US' },
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
      boardId: 9138987515,
      itemName: name,
      columnValues: JSON.stringify(columnValues), // stringify this!
    };

    console.log('Using API Key:', MONDAY_API_KEY ? 'Yes' : 'No');
    console.log('Submitting to Monday.com with:', variables);

    const response = await axios.post(
      'https://api.monday.com/v2',
      { query, variables },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MONDAY_API_KEY}`,
        },
      }
    );

    console.log('Monday API response:', response.data);

    if (response.data.errors) {
      console.error('Monday API error:', response.data.errors);
      return res.status(500).json({ error: 'Failed to create item on Monday.com.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error submitting to Monday:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Server error submitting form.' });
  }
}
