
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

module.exports = {
    name: "ready",
    once: "true",
    execute(client) {

      app.get('/status', (req, res) => { res.json( {status: 200, message: 'OK'}) });
      server.listen(3000, () => {});
      
      function executeGetRequest() {
        http.get(process.env.ServerUrl, (res) => {
        let data = '';
      
        res.on('data', (chunk) => { data += chunk });
        res.on('end', () => {
          try {  } catch {}
        });
      }).on('error', (err) => {});
    }
      
      executeGetRequest();
      setInterval(executeGetRequest, 5 * 60 * 1000);
      
    }
}