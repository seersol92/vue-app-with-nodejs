const http = require('http');
const app = require('./app');

const port = process.env.PORT || 8081;

const server = http.createServer(app);

app.listen(port, ()=>{
    console.log('listening on the port ' + port);
  });