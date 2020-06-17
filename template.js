module.exports = {
    html: (nameList, dataCardSet, update) => {
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
        `
    },
    list: (name) => {
        let nameList = '';
        name.map((name) => {
            nameList = nameList + `<li style="margin-right: 1rem; margin-left: 1rem;"><a href="#${name}">${name}`
            nameList = nameList + '</a></li>';
        });
        return nameList;
    }
}