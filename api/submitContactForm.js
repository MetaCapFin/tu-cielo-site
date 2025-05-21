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

  const boardId = 9138987515;
  const groupId = "group_title";
  const apiKey = process.env.MONDAY_API_KEY;

  const columnValues = {
    text_mkqxc5rw: name,
    text_mkqxaajc: community,
    text_mkqy7dse: city,
    text_mkqyp01b: role,
    numeric_mkqxegkv: Number(budget) || 0,
    email_mkqxn7zz: JSON.stringify({ email: email, text: email }),
    phone_mkqxprbj: JSON.stringify({ phone: phone, countryShortName: "US" }),
  };

  const query = `
    mutation {
      create_item (
        board_id: ${boardId},
        group_id: "${groupId}",
        item_name: "${name} Contact",
        column_values: "${JSON.stringify(columnValues).replace(/"/g, '\\"')}"
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
        Authorization: `Bearer ${apiKey}`,  // <-- Fix is here
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error(data.errors);
      return res.status(500).json({ error: 'Failed to create item in Monday.com' });
    }

    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
