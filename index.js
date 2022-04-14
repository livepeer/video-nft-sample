const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const proxy = createProxyMiddleware({
    target: 'https://livepeer.com',
    changeOrigin: true,
    headers: {
        authorization:  `Bearer  ${process.env.LP_API_KEY}`
    }
});





app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });
app.get('/api/asset/:id', proxy);
app.get('/api/task/:id', proxy);
app.post('/api/asset/request-upload', proxy);
app.post('/api/asset/transcode', proxy);
app.post('/api/asset/:id/export', proxy);


app.listen(PORT);