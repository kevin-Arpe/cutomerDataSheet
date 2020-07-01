const fs = require('fs');
const db = require('./db.js');

module.exports = (customers) => {
    let dataCardSet = '';

    customers.map((customer) => {
        dataCardSet = dataCardSet + `
            <div class="dataCard" id="${customer.id}">
                <span class="name"><a href="/update?id=${customer.id}">${customer.name}</a></span>
                <ul class="info">
                    <li class="birth">생년월일 : <span>${customer.birth}</span></li>
                    <li class="email">E-mail : <a href="${customer.email}">${customer.email}</a></li>
                    <li class="edu">Education : <span>${customer.edu}</span></li>
                    <li class="detail">Details : <span>${customer.detail}</span></li>
                </ul>
            </div>
        `;
        /*
        let dataSet = fs.readFileSync(`./data/${customer}`, 'utf8').split(',');
        dataCardSet = dataCardSet + `
            <div class="dataCard" id="${customer.id}">
                <span class="name"><a href="/update?id=${customer.id}">${customer.name}</a></span>
                <ul class="info">
                    <li class="birth">생년월일 : <span>${dataSet[0]}</span></li>
                    <li class="email">E-mail : <a href="${dataSet[1]}">${dataSet[1]}</a></li>
                    <li class="edu">Education : <span>${dataSet[2]}</span></li>
                    <li class="detail">Details : <span>${dataSet[3]}</span></li>
                </ul>
            </div>
        `;
        */
    });
    return dataCardSet;
}