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

  if (req.method !== 'GET') {
    res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
    return;
  }

  const { id } = req.query;

  if (!id) {
    res.status(400).json({ status: 'error', message: 'Payment ID is required' });
    return;
  }

  const apiKey = process.env.PAYSUITE_API_KEY;
  if (!apiKey) {
    res.status(500).json({ status: 'error', message: 'PAYSUITE_API_KEY environment variable is not configured' });
    return;
  }

  const options = {
    hostname: 'paysuite.tech',
    port: 443,
    path: `/api/v1/payments/${id}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
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
        if (response.statusCode === 200 && parsedData.status === 'success') {
          const isPaid = parsedData.data.status === 'paid';
          
          if (isPaid && parsedData.data.reference) {
            const reference = parsedData.data.reference;
            if (reference.startsWith('PRO') && reference.length > 16) {
              const cleanId = reference.substring(3, reference.length - 13);
              let clerkUserId = cleanId;
              if (cleanId.startsWith('user')) {
                clerkUserId = 'user_' + cleanId.substring(4);
              }
              const clerkSecretKey = process.env.CLERK_SECRET_KEY;
              
              if (clerkUserId && clerkUserId !== 'anonymous' && clerkSecretKey) {
                // Update Clerk via HTTP
                const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
                
                const clerkPostData = JSON.stringify({
                  public_metadata: {
                    premiumExpiresAt: expiresAt,
                    isPremium: true
                  }
                });
                
                const clerkOptions = {
                  hostname: 'api.clerk.com',
                  port: 443,
                  path: `/v1/users/${clerkUserId}/metadata`,
                  method: 'PATCH',
                  headers: {
                    'Authorization': `Bearer ${clerkSecretKey}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(clerkPostData)
                  }
                };
                
                const clerkReq = https.request(clerkOptions, (clerkRes) => {
                  let clerkData = '';
                  clerkRes.on('data', d => { clerkData += d; });
                  clerkRes.on('end', () => {
                    console.log('Clerk Metadata Updated:', clerkRes.statusCode);
                    // Return response after Clerk updates
                    res.status(200).json({ status: 'success', paid: isPaid, details: parsedData.data });
                  });
                });
                
                clerkReq.on('error', (e) => {
                  console.error('Clerk Update Error:', e);
                  // Return success anyway since payment succeeded
                  res.status(200).json({ status: 'success', paid: isPaid, details: parsedData.data });
                });
                
                clerkReq.write(clerkPostData);
                clerkReq.end();
                return; // Prevent immediate response below
              }
            }
          }

          res.status(200).json({ status: 'success', paid: isPaid, details: parsedData.data });
        } else {
          res.status(response.statusCode).json(parsedData);
        }
      } catch (e) {
        res.status(500).json({ status: 'error', message: 'Failed to parse PaySuite response', error: data });
      }
    });
  });

  request.on('error', (error) => {
    res.status(500).json({ status: 'error', message: 'PaySuite request failed', error: error.message });
  });

  request.end();
};
