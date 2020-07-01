const fs = require('fs');

module.exports = (name) => {
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