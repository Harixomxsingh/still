const https = require('https');

/**
 * Sends a real-time Remote Push Notification to any Android/iOS device
 * directly from the cloud using Expo Push Servers (works when app is completely closed!)
 */
async function sendRemotePush({ pushToken, title, body, delaySeconds = 0 }) {
  if (!pushToken) {
    console.error('❌ Error: No push token provided.');
    return;
  }

  console.log(`⏳ Waiting ${delaySeconds} seconds before sending cloud push...`);
  if (delaySeconds > 0) {
    await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
  }

  const payload = JSON.stringify({
    to: pushToken,
    title: title || 'Still',
    body: body || 'make your self calm 🪷',
    sound: 'default',
    priority: 'high',
    channelId: 'still_mindfulness_channel',
    data: { url: 'https://harixomxsingh.github.io/still/' },
  });

  const options = {
    hostname: 'exp.host',
    path: '/--/api/v2/push/send',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('🚀 [CLOUD PUSH DELIVERED]:', data);
    });
  });

  req.on('error', (e) => {
    console.error('❌ Cloud push error:', e.message);
  });

  req.write(payload);
  req.end();
}

// Check arguments or default
const args = process.argv.slice(2);
const token = args[0] || process.env.EXPO_PUSH_TOKEN;
const message = args[1] || 'make your self calm 🪷';
const delay = parseInt(args[2] || '0', 10);

if (token) {
  sendRemotePush({ pushToken: token, title: 'Still', body: message, delaySeconds: delay });
} else {
  console.log('ℹ️ Usage: node scripts/send_remote_push.js <PUSH_TOKEN> "<MESSAGE>" <DELAY_SECONDS>');
}

module.exports = { sendRemotePush };
