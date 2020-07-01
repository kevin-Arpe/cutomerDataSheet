const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const db = require('./lib/db.js');

const template = require('./lib/template.js');
const templateHTML = template.html;
const templateList = template.list;
const makeDataCardSet = require('./lib/makecard.js')

db.connect();

const app = http.createServer((request, response) => {
    let _url = request.url;
    let pathname = url.parse(_url, true).pathname;
    let queryData = url.parse(_url, true).query;
    
    if (pathname === '/') {
        pathname = '/index.html';
        fs.readdir('./data', (err, name) => {
            let nameList = templateList(name);
            let dataCardSet = makeDataCardSet(name);
            let template = templateHTML(nameList, dataCardSet, '');

            response.writeHead(200, {"Contdent-Type": "text/html"});
            response.end(template);
        });
    }

    else if (pathname == '/update') {
        fs.readdir('./data', (err, name) => {
            let id = queryData.id;
            let filteredId = path.parse(id).base;

            fs.readFile(`data/${filteredId}`, 'utf8', (err, data) => {
                let nameList = templateList(name);
                let dataCardSet = makeDataCardSet(name);
                let template = templateHTML(nameList, dataCardSet, `
                <form action="/update_process" method="post" style="display: flex; flex-direction: column; width: 600px;">
                    <input type="hidden" name="id" value="${filteredId}">
                    <input type="text" name="name" placeholder="customer name" value="${filteredId}">
                    <textarea name="info" placeholder="customer data">${data}</textarea>
                    <input type="submit">
                </form>
                <form action="/delete_process" method="post">
                    <input type="hidden" name="id" value="${filteredId}">
                    <input type="submit" value="delete">
                </form>
                `);

                response.writeHead(200, {"Content-Type": "text/html"});
                response.end(template);
            });
        });
    }

    else if (pathname === '/update_process') {
        let body = '';
        request.on('data', (data) => {
            body = body + data;
        });
        request.on('end', () => {
            let post = qs.parse(body);
            let name = post.name;
            let info = post.info;
            let id = post.id;

            const sanitizedName = sanitizeHtml(name);
            const sanitizedInfo = sanitizeHtml(info);

            fs.rename(`data/${id}`, `data/${sanitizedName}`, (err) => {
                fs.writeFile(`data/${sanitizedName}`, sanitizedInfo, 'utf8', (err) => {
                    response.writeHead(302, {Location : '/'});
                    response.end();
                });
            });
        });
    }

    else if (pathname === '/create_process') {
        let body = '';
        request.on('data', (data) => {
            body = body + data;
        });
        request.on('end', () => {
            let post = qs.parse(body);
            let name = post.name;
            let info = post.info;

            const sanitizedName = sanitizeHtml(name);
            const sanitizedInfo = sanitizeHtml(info, {allowedTags: ['h1']});

            fs.writeFile(`data/${sanitizedName}`, sanitizedInfo, 'utf8', (err) => {
                response.writeHead(302, {Location : '/'});
                response.end();
            });
        });
    }

    else if (pathname === '/delete_process') {
        let body = '';
        request.on('data', (data) => {
            body = body + data;
        });
        request.on('end', () => {
            let post = qs.parse(body);
            let id = post.id;

            fs.unlink(`data/${id}`, (err) => {
                response.writeHead(302, {Location : '/'});
                response.end();
            });
        });
    }

    else {
        response.writeHead(404);
        response.end("NOT FOUND");
    }
});

app.listen(3000);