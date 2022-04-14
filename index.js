const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();
const proxy = createProxyMiddleware({
    target: 'https://livepeer.com',
    changeOrigin: true,
    headers: {
        authorization:  'Bearer  be04037c-20ba-4d6d-9a23-2c102bd76dc1'
    }
});




app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });
app.get('/api/asset/:id', proxy);
app.get('/api/task/:id', proxy);
app.post('/api/asset/request-upload', proxy);
app.post('/api/asset/transcode', proxy);
app.post('/api/asset/:id/export', proxy);

app.listen(3000);