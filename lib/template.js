exports.html = (nameList, dataCardSet, update) => {
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
                <input type="hidden" name="id">
                <input type="text" name="name" placeholder="customer name">
                <input type="text" name="birth" placeholder="birth">
                <input type="text" name="email" placeholder="email" >
                <input type="text" name="edu" placeholder="education name">
                <textarea name="detail" placeholder="detail"></textarea>
                <input type="submit" value="create">
            </form>
            <div class="customerList">
                <div class="list_title">고객 리스트</div>
                <ul class="list_name" style="display: flex;">
                    ${nameList}
                </ul>
            </div>
            ${update}
            <div class="container">
                <div class="title">Cutomer DataSheet</div>
                ${dataCardSet}
            </div>
        </main>
    </body>
    </html>
    `
}

exports.list = (customers) => {
    let nameList = '';
    customers.map((customer) => {
        nameList = nameList + `<li style="margin-right: 1rem; margin-left: 1rem;"><a href="#${customer.name}">${customer.name}`
        nameList = nameList + '</a></li>';
    });
    return nameList;
}