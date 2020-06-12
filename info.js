const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const makeNameList = (name) => {
    let nameList = '';
    name.map((name) => {
        nameList = nameList + `<li style="margin-right: 1rem; margin-left: 1rem;"><a href="#${name}">${name}`
        nameList = nameList + '</a></li>';
    });
    return nameList;
}

const makeDataCardSet = (name) => {
    let dataCardSet = '';

    name.map((name) => {
        let dataSet = fs.readFileSync(`./data/${name}`, 'utf8').split(',');
        dataCardSet = dataCardSet + `
            <div class="dataCard" id="${name}">
                <span class="name"><a href="/update?id=${name}">${name}</a></span>
                <ul class="info">
                    <li class="birth">생년월일 : <span>${dataSet[0]}</span></li>
                    <li class="email">E-mail : <a href="${dataSet[1]}">${dataSet[1]}</a></li>
                    <li class="edu">Education : <span>${dataSet[2]}</span></li>
                    <li class="detail">Details : <span>${dataSet[3]}</span></li>
                </ul>
            </div>
        `;
    });
    return dataCardSet;
}

const templateHTML = (nameList, dataCardSet, update) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cutomer DataSheet</title>
        <script>
            const dateBox = document.querySelector('.date');
            let date = new Date();
            let today = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
            date.innerText = today;
        </script>
    </head>
    <body>
        <header>
            <div class="date">2020.06.04 Thurs</div>
            <a href="/">Home</a>
        </header>
        <main>
            <form action="/create_process" method="post" style="display: flex; flex-direction: column; width: 600px;">
                <input type="text" name="name" placeholder="customer name">
                <textarea name="info" placeholder="customer data"></textarea>
                <input type="submit">
            </form>
            ${update}
            <div class="customerList">
                <div class="list_title">고객 리스트</div>
                <ul class="list_name" style="display: flex;">
                    ${nameList}
                </ul>
            </div>
            <div class="container">
                <div class="title">Cutomer DataSheet</div>
                ${dataCardSet}
            </div>
        </main>
    </body>
    </html>
    `;
}

const app = http.createServer((request, response) => {
    let _url = request.url;
    let pathname = url.parse(_url, true).pathname;
    let queryData = url.parse(_url, true).query;
    
    if (pathname === '/') {
        pathname = '/index.html';
        fs.readdir('./data', (err, name) => {
            let nameList = makeNameList(name);
            let dataCardSet = makeDataCardSet(name);
            let template = templateHTML(nameList, dataCardSet, '');

            response.writeHead(200, {"Contdent-Type": "text/html"});
            response.end(template);
        });
    }

    else if (pathname == '/update') {
        fs.readdir('./data', (err, namde) => {
            let id = queryData.id;

            fs.readFile(`data/${id}`, 'utf8', (err, data) => {
                let nameList = makeNameList(name);
                let dataCardSet = makeDataCardSet(name);
                let template = templateHTML(nameList, dataCardSet, `
                <form action="/update_process" method="post" style="display: flex; flex-direction: column; width: 600px;">
                    <input type="hidden" name="id" value="${id}">
                    <input type="text" name="name" placeholder="customer name" value="${id}">
                    <textarea name="info" placeholder="customer data">${data}</textarea>
                    <input type="submit">
                </form>
                <form action="/delete_process" method="post">
                    <input type="hidden" name="id" value="${id}">
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

            fs.rename(`data/${id}`, `data/${name}`, (err) => {
                fs.writeFile(`data/${name}`, info, 'utf8', (err) => {
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

            fs.writeFile(`data/${name}`, info, 'utf8', (err) => {
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