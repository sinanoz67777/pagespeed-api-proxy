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
  const { url, strategy = 'desktop' } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parametresi gerekli' });
  }

  // sadece mobile veya desktop kabul et, değilse hata dön
  if (!['mobile', 'desktop'].includes(strategy)) {
    return res.status(400).json({ error: "Geçersiz strategy parametresi. 'mobile' veya 'desktop' olmalı." });
  }

  try {
    const result = await axios.get(
      'https://www.googleapis.com/pagespeedonline/v5/runPagespeed',
      {
        params: {
          url: url,
          strategy: strategy,
          key: process.env.API_KEY
        }
      }
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
