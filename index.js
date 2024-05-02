const fs = require("fs");
const http = require("http");
const url = require("url");

const data = fs.readFileSync(`${__dirname}/dev-data/db.json`, "utf-8");
const dataObj = JSON.parse(data);

const tempHomePage = fs.readFileSync(
  `${__dirname}/templates/homepage.html`,
  "utf-8"
);
const tempUserDetail = fs.readFileSync(
  `${__dirname}/templates/user-detail.html`,
  "utf-8"
);
const tempUserRow = fs.readFileSync(
  `${__dirname}/templates/userrow.html`,
  "utf-8"
);

const replaceTemplate = (tempUserRow, user) => {
  let output = tempUserRow.replace(/{%USERID%}/g, user.id);
  output = output.replace(/{%USERNAME%}/g, user.name);
  output = output.replace(/{%USERNAME%}/g, user.name);
  output = output.replace(/{%USEREMAIL%}/g, user.email);
  output = output.replace(
    /{%ADDRESS%}/g,
    `${user.address.street},${user.address.suite},${user.address.city}`
  );

  return output;
};

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === "/") {
    const output = dataObj
      .map((user) => replaceTemplate(tempUserRow, user))
      .join("");

    const mainHTML = tempHomePage.replace("{%USERROW%}", output);

    res.writeHead(200, {
      "Contect-type": "text/html",
    });
    res.end(mainHTML);
  } else if (pathname === "/user") {
    res.writeHead(200, {
      "content-type": "text/html",
    });

    const output = replaceTemplate(tempUserDetail, dataObj[query.id - 1]);
    res.end(output);
  } else {
    res.end("Page not found");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server running at port 8000");
});
