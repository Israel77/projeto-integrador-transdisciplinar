const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 6969;

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
app.use("/login", express.static(path.join(__dirname, "pages/login")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/components", express.static(path.join(__dirname, "components")));
app.use(express.static(__dirname));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});