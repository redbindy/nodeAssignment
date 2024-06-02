// 실습
const express = require("express");
// const mysql = require("mysql");
const dbconfig = require("./dbconf.js");
const mariadb = require("mariadb/callback");

const connection = mariadb.createConnection(dbconfig);
const app = express();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/practice.html");
});

app.get("/coders", (req, res) => {
    connection.query("select * from coders", (error, rows) => {
        if (error) {
            throw error;
        }

        console.log("Coder info is: ", rows);
        res.send(rows);
    });
});

app.get("/coders/lee", (req, res) => {
    connection.query("select * from coders where name = \"Lee\"", (error, rows) => {
        if (error) {
            throw error;
        }

        console.log(rows);
        res.send(rows);
    });
});

app.get("/tables", (req, res) => {
    connection.query("select * from coders", (error, rows) => {
        if (error) {
            throw error;
        }

        str = "<table>";

        for (var i = 0; i < rows.length; ++i) {
            str += "<tr>";
            str = str
                + "<td>"
                + rows[i].id
                + "</td><td>" + rows[i].name
                + "</td><td>";

            str = str
                + "<td>"
                + rows[i].address
                + "</td><td>"
                + rows[i].score
                + "</td>";
            str += "</tr>";
        }

        res.send(str);
    });
});

app.use(function (error, req, res, next) {

    if (error) {
        res.send("<h1>Sorry, page not found :(</h1>");
    }
});

app.listen(3000, () => {
    console.log("Express Server listening on port 3000");
});

// 홈페이지
app.get("/main", (req, res) => {
    connection.query("select * from posts order by date desc", (error, rows) => {

        var frontHtml = "<html><h1>게시글</h1><body><table id=\"post_table\"><thead><th>날짜</th><th>제목</th><th>작성자</th><th><button onclick=\"GoToWritePage()\">글쓰기</button></th></thead><tbody>";
        var rowData = "";
        var backHtml = "</tbody></table></body><script>function GoToWritePage() {window.location.href = \"main/write\";};</script></html>";

        if (error) {
            console.log(error);
        } else {
            rows.forEach((row) => {
                rowData += "<tr>"
                    + "<td>"
                    + row.date
                    + "</td>"
                    + "<td>" + "<a href=\"/main/post/"
                    + row.title + "\">"
                    + row.title
                    + "</a>" + "</td>"
                    + "<td>"
                    + row.author
                    + "</td>"
                    + "</tr>";
            });
        }

        res.send(frontHtml + rowData + backHtml);
    });
});

app.get("/main/write", (req, res) => {
    res.sendFile(__dirname + "/write.html");
});

app.use(express.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    // const password = crypto.createHash("sha512")
    //     .update(req.body.password + salt)
    //     .digest("hex");
    const content = req.body.content;

    const insertQuery = "insert into posts values("
        + '\"' + author + '\"'
        + ", "
        + '\"' + title + '\"'
        + ", "
        + '\"' + content + '\"'
        + ", "
        + "now()"
        + ");";

    connection.query(insertQuery, (error) => {
        if (error) {
            console.log(error);
        }
    });

    res.redirect("./main");
});

app.get("/main/post/:title", (req, res) => {
    connection.query("SELECT * FROM posts WHERE title = ?", [req.params.title], (error, rows) => {
        if (error) {
            console.log(error);
        } else if (rows.length > 0) {

            const row = rows[0];

            let page = "";
            page += "<html><head><title>게시물</title></head><body>"
                + "<h1>"
                + row.title
                + "</h1>"
                + "<p>작성자: "
                + row.author
                + "</p>"
                + "<p>"
                + row.content
                + "</p>"
                + "</body></html>";

            res.send(page);
        }
    });
});