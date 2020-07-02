const http = require('http');
const url = require('url');
const db = require('./lib/db.js');
const topic = require('./lib/topic.js');

const template = require('./lib/template.js');

db.connect();

const app = http.createServer((request, response) => {
    let _url = request.url;
    let pathname = url.parse(_url, true).pathname;
    let queryData = url.parse(_url, true).query;
    
    if (pathname === '/') {
        topic.home(request, response);
    }
    else if (pathname == '/update') {
        topic.update(request, response, queryData);
    }
    else if (pathname === '/update_process') {
        topic.update_process(request, response);
    }

    else if (pathname === '/create_process') {
        topic.create_process(request, response);
    }

    else if (pathname === '/delete_process') {
        topic.delete_process(request, response);
    }

    else {
        response.writeHead(404);
        response.end("NOT FOUND");
    }
});

app.listen(3000);