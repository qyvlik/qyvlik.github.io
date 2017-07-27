let http = require('http');
let url = require('url');
let fs = require('fs');
let path = require('path');
let mine = {
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

let fileCache = {};

let server = http.createServer(function (request, response) {
    let pathname = url.parse(request.url).pathname;

    let realPath = "." + decodeURIComponent(pathname);

    if (realPath === "./") {
        realPath = "./index.html"
    }

    let contentFromCache = fileCache[realPath];
    if (typeof contentFromCache !== 'undefined') {
        console.log("match cache : ", realPath);
        response.writeHead(200, {
            'Content-Type': contentFromCache.contentType
        });
        response.write(contentFromCache.fileContent, "binary");
        response.end();
        return;
    }

    console.log(`read realPath:${realPath}`);

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
            fs.readFile(realPath, "binary", function (err, fileContent) {
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

                    let fileContentCache = {
                        "contentType": contentType,
                        "file": realPath,
                        "fileContent": fileContent
                    };

                    fileCache[realPath] = fileContentCache;

                    response.write(fileContent, "binary");
                    response.end();
                }
            });
        }
    });
});
let port = 8082;
server.listen(port);

console.log(`server listen localhost:${port}`);

require("./updatePostList.js");