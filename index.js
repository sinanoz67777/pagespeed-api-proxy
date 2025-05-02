const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

// 1) Health‐check rotası
app.get('/', (req, res) => {
  res.send('PageSpeed API Proxy is up and running!');
});

// 2) Asıl PageSpeed endpoint
app.get('/pagespeed', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL parametresi gerekli' });
  }
  try {
    const result = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${process.env.API_KEY}`
    );
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: 'PageSpeed API hatası', details: error.message });
  }
});

// 3) Dinlenecek port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
