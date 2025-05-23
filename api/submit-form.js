const MONDAY_API_URL = 'https://api.monday.com/v2';
const BOARD_ID = 9221044692;
const EMAIL_COLUMN_ID = 'email_mkr7vb0c';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing name or email' });
  }

  try {
    const apiKey = process.env.MONDAY_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing Monday API key' });
    }

    // Escape any backslashes and quotes in name and email for safe insertion into GraphQL query
    const safeName = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const safeEmail = email.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

    // Properly escape column values as JSON string
    const columnValues = JSON.stringify({ [EMAIL_COLUMN_ID]: safeEmail });

    // Construct the GraphQL mutation query with escaped strings
    const createItemQuery = `
      mutation {
        create_item (
          board_id: ${BOARD_ID},
          item_name: "${safeName}",
          column_values: "${columnValues.replace(/"/g, '\\"')}"
        ) {
          id
        }
      }
    `;

    const response = await fetch(MONDAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({ query: createItemQuery }),
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(500).json({ error: data.errors[0].message || 'Monday API error' });
    }

    return res.status(200).json({ success: true, itemId: data.data.create_item.id });
  } catch (error) {
    console.error('Error creating Monday item:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

