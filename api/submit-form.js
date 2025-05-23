const MONDAY_API_URL = 'https://api.monday.com/v2';
const MONDAY_API_URL = 'https://api.monday.com/v2';
const BOARD_ID = 9221044692;
const EMAIL_COLUMN_ID = 'email_mkr7vb0c';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;
  console.log('Received data:', { name, email });

  if (!name || !email) {
    console.log('Missing name or email');
    return res.status(400).json({ error: 'Missing name or email' });
  }

  try {
    const apiKey = process.env.MONDAY_API_KEY;
    console.log('Using API key:', apiKey ? '✓ Present' : '✗ Missing');
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing Monday API key' });
    }

    // Escape quotes and backslashes in the item name
    const safeName = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

    // Proper email column value format for Monday.com email column
    const columnValues = {
      [EMAIL_COLUMN_ID]: {
        email,
        text: name,
      },
    };

    // Double stringify columnValues so it is a valid GraphQL string literal
    const createItemQuery = `
      mutation {
        create_item (
          board_id: ${BOARD_ID},
          item_name: "${safeName}",
          column_values: ${JSON.stringify(JSON.stringify(columnValues))}
        ) {
          id
        }
      }
    `;

    console.log('GraphQL query:', createItemQuery);

    const response = await fetch(MONDAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({ query: createItemQuery }),
    });

    const raw = await response.text();
    console.log('Raw Monday response:', raw);

    const data = JSON.parse(raw);

    if (data.errors) {
      console.log('Monday API returned errors:', JSON.stringify(data.errors, null, 2));
      return res.status(500).json({ error: data.errors.map(e => e.message).join(', ') });
    }

    if (!data?.data?.create_item?.id) {
      console.log('Unexpected Monday response format:', data);
      return res.status(500).json({ error: 'Invalid response from Monday API' });
    }

    return res.status(200).json({ success: true, itemId: data.data.create_item.id });
  } catch (error) {
    console.error('Error creating Monday item:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}






