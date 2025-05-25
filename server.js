import express from 'express';
import cron from 'node-cron';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => res.status(200).send('OK'));

// Root endpoint
app.get('/', (req, res) => res.send('Server running'));

// Self-ping every 10 minutes to keep service awake
const SELF_URL = process.env.SELF_URL || `http://localhost:${PORT}`;
cron.schedule('*/10 * * * *', async () => {
  try {
    const response = await fetch(`${SELF_URL}/health`);
    console.log(`[Self-Ping] Status: ${response.status} at ${new Date().toISOString()}`);
  } catch (err) {
    console.error(`[Self-Ping] Error: ${err.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});