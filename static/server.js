const express = require("express");
const path = require("path");
const http = require("http");
const https = require("https");

const app = express();
const port = process.env.FRONTEND_PORT || 6969;
const securePort = process.env.FRONTEND_HTTPS_PORT || 3443;

const sslKey = process.env.SSL_KEY || "";
const sslCert = process.env.SSL_CERT || "";

// Custom MIME types
const customMimeTypes = {
    '.json': 'application/json',
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    // Add more custom MIME types as needed
};

// Middleware to set custom MIME types
app.use((req, res, next) => {
    const ext = path.extname(req.url);
    if (customMimeTypes[ext]) {
        res.setHeader('Content-Type', customMimeTypes[ext]);
    }
    next();
});

app.use("/main", express.static(path.join(__dirname, "pages/main")));
app.use("//main", express.static(path.join(__dirname, "pages/main")));
app.use("/login", express.static(path.join(__dirname, "pages/login")));
app.use("//login", express.static(path.join(__dirname, "pages/login")));
app.use("/sign-up", express.static(path.join(__dirname, "pages/sign-up")));
app.use("//sign-up", express.static(path.join(__dirname, "pages/sign-up")));
app.use("/criar-quadro", express.static(path.join(__dirname, "pages/criar-quadro")));
app.use("//criar-quadro", express.static(path.join(__dirname, "pages/criar-quadro")));
app.use("/recuperar-senha", express.static(path.join(__dirname, "pages/recuperar-senha")));
app.use("//recuperar-senha", express.static(path.join(__dirname, "pages/recuperar-senha")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("//css", express.static(path.join(__dirname, "css")));
app.use("/components", express.static(path.join(__dirname, "components")));
app.use("//components", express.static(path.join(__dirname, "components")));
app.use(express.static(__dirname));
app.use("//", express.static(__dirname));

// Erro 404
app.use((req, res) => {
    console.log(`404 - ${req.url}`);
    res.status(404);

    if (req.accepts("text/html")) {
        res.sendFile(path.join(__dirname, "pages/404/index.html"));
    } else if (req.accepts("application/json")) {
        res.json({ error: "Not found" });
    } else {
        res.type("txt").send("Not found");
    }
});



http.createServer(app).listen(port);
https.createServer({
    key: sslKey,
    cert: sslCert
}, app).listen(securePort);