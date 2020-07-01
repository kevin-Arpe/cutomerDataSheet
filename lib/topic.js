const db = require('./db.js');
const qs = require('querystring');
const sanitizeHtml = require('sanitize-html');

const template = require('.//template.js');
const templateHTML = template.html;
const templateList = template.list;
const makeDataCardSet = require('./makecard.js')

exports.home = (request, response) => {
    pathname = '/index.html';
    db.query('SELECT * FROM customer', (err, customers) => {
        let nameList = templateList(customers);
        let dataCardSet = makeDataCardSet(customers);
        let template = templateHTML(nameList, dataCardSet, '');

        response.writeHead(200);
        response.end(template);

        /*
        let nameList = templateList(name);
        let dataCardSet = makeDataCardSet(name);
        let template = templateHTML(nameList, dataCardSet, '');

        response.writeHead(200, {"Cotdent-Type": "text/html"});
        response.end(template);
        */
    });
    /*
    fs.readdir('./data', (err, name) => {
        let nameList = templateList(name);
        let dataCardSet = makeDataCardSet(name);
        let template = templateHTML(nameList, dataCardSet, '');

        response.writeHead(200, {"Contdent-Type": "text/html"});
        response.end(template);
    });
    */
}

exports.create_process = (request, response) => {
    let body = '';
    request.on('data', (data) => {
        body = body + data;
    });
    request.on('end', () => {
        let post = qs.parse(body);
        let id = post.id;
        let name = post.name;
        let birth = post.birth;
        let email = post.email;
        let edu = post.edu;
        let detail = post.detail;

        const sanitizedName = sanitizeHtml(name);

        db.query(`CREATE INTO customer (name, birth, email, edu, detail) VALUES (?, ?, ?, ?, ?) WHERE customer.id=?`, [name, birth, email, edu, detail, id], (err) => {
            response.writeHead(302, {Location : '/'});
            response.end();
        });

        /* 
        fs.writeFile(`data/${sanitizedName}`, sanitizedInfo, 'utf8', (err) => {
            response.writeHead(302, {Location : '/'});
            response.end();
        });
         */
    });
}

exports.update = (request, response, queryData) => {
    db.query(`SELECT * FROM customer`, (err1, customers) => {
        if (err1) {
            throw err1;
        }
        db.query(`SELECT * FROM customer WHERE customer.id = ?`, [queryData.id], (err2, customer) => {
            if (err2) {
                throw err2;
            }
    
            let nameList = templateList(customers);
            let dataCardSet = makeDataCardSet(customers);
            let template = templateHTML(nameList, dataCardSet, `
            <form action="/update_process" method="post" style="display: flex; flex-direction: column; width: 600px;">
                <input type="hidden" name="id" value="${customer[0].id}">
                <input type="text" name="name" value=${customer[0].name} placeholder="customer name">
                <input type="text" name="birth" value=${customer[0].birth} placeholder="birth">
                <input type="text" name="email" placeholder="email" value="${customer[0].email}">
                <input type="text" name="edu" placeholder="education name" value="${customer[0].edu}">
                <textarea name="detail" placeholder="detail">${customer[0].detail}</textarea>
                <input type="submit">
            </form>
            <form action="/delete_process" method="post">
                <input type="hidden" name="id" value="${customer[0].id}">
                <input type="submit" value="delete">
            </form>
            `);
    
            response.writeHead(200, {"Content-Type": "text/html"});
            response.end(template);
        });
    })

    /* 
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
     */
}

exports.update_process = (request, response) => {
    let body = '';
    request.on('data', (data) => {
        body = body + data;
    });
    request.on('end', () => {
        let post = qs.parse(body);
        let id = post.id;
        let name = post.name;
        let birth = post.birth;
        let email = post.email;
        let edu = post.edu;
        let detail = post.detail;

        const sanitizedName = sanitizeHtml(name);

        db.query(`UPDATE customer SET name=?, birth=?, email=?, edu=?, detail=? WHERE customer.id=?`, [sanitizedName, birth, email, edu, detail, id], (err, customers) => {
            response.writeHead(302, {Location: '/'});
            response.end();
        });

/*         
        fs.rename(`data/${id}`, `data/${sanitizedName}`, (err) => {
            fs.writeFile(`data/${sanitizedName}`, sanitizedInfo, 'utf8', (err) => {
                response.writeHead(302, {Location : '/'});
                response.end();
            });
        });
 */
    });
}

exports.delete_process = (request, response) => {
    let body = '';
    request.on('data', (data) => {
        body = body + data;
    });
    request.on('end', () => {
        let post = qs.parse(body);
        let id = post.id;

        db.query(`DELETE FROM customer WHERE customer.id=?`, [id], (err) => {
            response.writeHead(302, {Location: '/'});
            response.end();
        });

        /* 
        fs.unlink(`data/${id}`, (err) => {
            response.writeHead(302, {Location : '/'});
            response.end();
        });
         */
    });
}