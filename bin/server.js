var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mine = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript;charset=utf-8",
    "json": "application/json;charset=utf-8",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain;charset=utf-8",
    "md": "text/plain;charset=utf-8",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};

let server = http.createServer(function (request, response) {
    let pathname = url.parse(request.url).pathname;

    let realPath = "." + decodeURIComponent(pathname);
    console.log(`realPath:${realPath}`);

    if (realPath === "./") {
        realPath = "./index.html"
    }

    let ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + realPath + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain;charset=utf-8'
                    });
                    response.end(err);
                } else {
                    let contentType = mine[ext] || "text/plain;charset=utf-8";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});
let port = 8082;
server.listen(port);

console.log(`server listen localhost:${port}`);