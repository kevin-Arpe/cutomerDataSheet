const http = require('http');
const fs = require('fs');

const app = http.createServer((request, response) => {
    let _url = request.url;
    
    if (_url == '/') {
        _url = '/index.html';
        fs.readdir('./data', (error, name) => {
            let nameList = '';
            let dataCardSet = '';

            name.map((name) => {
                nameList = nameList + `<li><a href="#${name}">${name}`
                nameList = nameList + '</a></li>';
                let dataSet = fs.readFileSync(`./data/${name}`, 'utf8').split(',');
                dataCardSet = dataCardSet + `
                    <div class="dataCard" id="${name}">
                        <span class="name">${name}</span>
                        <ul class="info">
                            <li class="birth">생년월일 : <span>${dataSet[0]}</span></li>
                            <li class="email">E-mail : <a href="${dataSet[1]}">${dataSet[1]}</a></li>
                            <li class="edu">Education : <span>${dataSet[2]}</span></li>
                            <li class="detail">Details : <span>${dataSet[3]}</span></li>
                        </ul>
                    </div>
                `;
            });

            let template = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Cutomer DataSheet</title>
                    </head>
                    <body>
                        <header>
                            <div class="date">2020.06.04 Thurs</div>
                        </header>
                        <main>
                            <div class="customerList">
                                <div class="list_title">고객 리스트</div>
                                <ul class="list_name">
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
            response.writeHead(200, {"Content-Type": "text/html"});
            response.end(template);
        });
    }

    if (_url == '/favicon.ico') {
        return response.writeHead(404);
    }
});

app.listen(3000);