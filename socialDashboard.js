/**
 * Social Accounts Dashboard for n8n
 * One-click OAuth integration for multiple social accounts
 * Run with: node socialDashboard.js
 */

const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

// n8n API info (self-hosted or Render instance)
const N8N_API = process.env.N8N_API_URL || 'http://localhost:5678';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

// Social services you want to integrate
const services = [
  { name: 'Gmail', nodeType: 'googleGmailOAuth2Api' },
  { name: 'Google Sheets', nodeType: 'googleSheetsOAuth2Api' },
  { name: 'Facebook', nodeType: 'facebookGraphApi' },
  { name: 'Instagram', nodeType: 'instagramOAuth2Api' },
  { name: 'TikTok', nodeType: 'tiktokOAuth2Api' },
  { name: 'YouTube', nodeType: 'youtubeOAuth2Api' },
  { name: 'LinkedIn', nodeType: 'linkedInOAuth2Api' },
  { name: 'X / Twitter', nodeType: 'twitterOAuth1Api' },
];

// Serve a simple dashboard
app.get('/', (req, res) => {
  let html = `
    <h1>Connect Your Social Accounts</h1>
    <p>Click a button below to connect your social account to n8n.</p>
    <ul style="list-style:none; padding:0;">`;

  services.forEach(service => {
    html += `<li style="margin:10px;">
               <form action="/connect/${service.nodeType}" method="get">
                 <button style="padding:10px 20px; font-size:16px;">Connect ${service.name}</button>
               </form>
             </li>`;
  });

  html += '</ul>';
  res.send(html);
});

// Endpoint to redirect user to OAuth for each service
app.get('/connect/:nodeType', async (req, res) => {
  const { nodeType } = req.params;

  try {
    // Construct OAuth URL (this is the n8n built-in redirect for credentials)
    const oauthUrl = `${N8N_API}/rest/credentials/oauth2/authorize?type=${nodeType}&apiKey=${N8N_API_KEY}`;
    res.redirect(oauthUrl);
  } catch (err) {
    res.send(`<p>Error initiating OAuth: ${err.message}</p>`);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Social Dashboard running at http://localhost:${PORT}`);
});
