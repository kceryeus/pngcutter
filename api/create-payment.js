const https = require('https');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
    return;
  }

  const { reference, description, return_url } = req.body;

  if (!reference) {
    res.status(400).json({ status: 'error', message: 'Reference is required' });
    return;
  }

  // Preço definido estritamente no backend para evitar manipulação de valores pelo utilizador no frontend.
  // IMPORTANTE: Alterar de "1.00" para "50.00" quando avançar para produção.
  const amount = "10.00";

  const apiKey = process.env.PAYSUITE_API_KEY;
  if (!apiKey) {
    res.status(500).json({ status: 'error', message: 'PAYSUITE_API_KEY environment variable is not configured' });
    return;
  }

  const postData = JSON.stringify({
    amount: String(amount),
    reference: String(reference),
    description: description || 'Premium Purchase',
    return_url: return_url || 'https://pngcutter-gama.vercel.app/app.html'
  });

  const options = {
    hostname: 'paysuite.tech',
    port: 443,
    path: '/api/v1/payments',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const request = https.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        res.status(response.statusCode).json(parsedData);
      } catch (e) {
        res.status(500).json({ status: 'error', message: 'Failed to parse PaySuite response', error: data });
      }
    });
  });

  request.on('error', (error) => {
    res.status(500).json({ status: 'error', message: 'PaySuite request failed', error: error.message });
  });

  request.write(postData);
  request.end();
};
