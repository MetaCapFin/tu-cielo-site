export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    name,
    community,
    city,
    role,
    budget,
    email,
    phone,
  } = req.body;

  const boardId = 9138987515; // Your board ID
  const groupId = "group_title"; // Your group ID
  const apiKey = process.env.MONDAY_API_KEY;

  // Build column values as an object
  const columnValues = {
    text_mkqxc5rw: name,
    text_mkqxaajc: community,
    text_mkqy7dse: city,
    text_mkqyp01b: role,
    numeric_mkqxegkv: Number(budget) || 0,
    email_mkqxn7zz: { email: email, text: email },
    phone_mkqxprbj: { phone: phone, countryShortName: "US" },
  };

  // Convert columnValues to a string and escape the result
  const columnValuesString = JSON.stringify(columnValues).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  // Construct the GraphQL mutation
  const query = `
    mutation {
      create_item (
        board_id: ${boardId},
        group_id: "${groupId}",
        item_name: "${name} Contact",
        column_values: "${columnValuesString}"
      ) {
        id
      }
    }
  `;

  try {
    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Monday API error:', data.errors);
      return res.status(500).json({ error: 'Failed to create item in Monday.com' });
    }

    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
