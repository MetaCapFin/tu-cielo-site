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

    // Escape quotes in name for item_name
    const safeName = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

    // Prepare column values object
    const columnValues = {
      [EMAIL_COLUMN_ID]: {
        email: email,
        text: email,
      },
    };

    // Convert to JSON string
    const columnValuesString = JSON.stringify(columnValues);

    // Escape the quotes inside JSON string for GraphQL
    const escapedColumnValues = columnValuesString.replace(/"/g, '\\"');

    // Build the GraphQL query string
    const query = `
      mutation {
        create_item(
          board_id: ${BOARD_ID},
          item_name: "${safeName}",
          column_values: "${escapedColumnValues}"
        ) {
          id
        }
      }
    `;

    // Make the API call
    const response = await fetch(MONDAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({ query }),
    });

    const raw = await response.text();
    const data = JSON.parse(raw);

    if (data.errors) {
      return res.status(500).json({ error: data.errors.map(e => e.message).join(', ') });
    }

    return res.status(200).json({ success: true, itemId: data.data.create_item.id });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
