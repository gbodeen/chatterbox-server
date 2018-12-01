const fs = require('fs');
const url = require('url');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

let nextId;
let messages = { results: [] };

fs.readFile('server/messages.txt', (err, data) => {
  messages.results = JSON.parse('[' + data.slice(0, -2) + ']');
  console.log(messages);
  nextId = messages.results[messages.results.length - 1].objectId + 1;
});

var requestHandler = function (request, response) {
  console.log(' ');
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  if (request.url === '/chatterbox/classes/messages' || request.url === '/classes/messages') {

    if (request.method === 'GET') {
      var statusCode = 200;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'application/json';
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(messages));
    }

    else if (request.method === 'POST') {
      var statusCode = 201;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'application/json';
      let data = '';
      request.on('data', chunk => {
        data += chunk;
      }).on('end', () => {
        let obj = JSON.parse(data);
        obj.createdAt = new Date();
        obj.objectId = nextId;
        nextId++;
        messages.results.push(obj);
        fs.appendFile('server/messages.txt',
          JSON.stringify(obj) + ',\n',
          err => { if (err) { console.log('That did not work.', err); } }
        );
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify(obj));
      });
    }

    else if (request.method === 'OPTIONS') {
      var statusCode = 200;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'text/plain';
      response.writeHead(statusCode, headers);
      response.end();
    }
  }

  else if (request.url.includes('client') || request.url.includes('node_modules')) {

    if (request.method === 'GET') {
      let fileName = url.parse(request.url).pathname;
      fileName = fileName.slice(1);
      console.log(fileName);
      let statusCode = 200;
      let headers = defaultCorsHeaders;
      if (fileName.includes('.js')) {
        headers['Content-Type'] = 'text/javascript';
      } else if (fileName.includes('.html')) {
        headers['Content-Type'] = 'text/html';
      } else if (fileName.includes('.css')) {
        headers['Content-Type'] = 'text/css';
      }
      response.writeHead(statusCode, headers);
      fs.readFile(fileName, (err, data) => {
        response.end(data);
      });
    }
  }

  else {
    var statusCode = 404;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'text/plain';
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(request.url) + ' is not a valid URL');
  }
};

exports.requestHandler = requestHandler;