const http = require('http');
const fs = require('fs');

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
    return dataCardSet;
}

const templateHTML = (nameList, dataCardSet) => {
    return `
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
    
    if (_url == '/') {
        _url = '/index.html';
        fs.readdir('./data', (error, name) => {
            let nameList = makeNameList(name);
            let dataCardSet = makeDataCardSet(name);
            let template = templateHTML(nameList, dataCardSet);

            response.writeHead(200, {"Content-Type": "text/html"});
            response.end(template);
        });
    }

    else {
        response.writeHead(404);
        response.end("NOT FOUND");
    }
});

app.listen(3000);