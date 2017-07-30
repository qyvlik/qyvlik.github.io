const travel = require("./travel.js");
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
var replaceAll = require("replaceall");

function travelPostDir(postDir) {
    let p = new Promise(function (resolve, reject) {
        let posts = [];
        travel(postDir, function (pathname) {
            let ext = path.extname(pathname).toLowerCase();
            let fileName = path.basename(pathname);
            // console.log("pathname:", pathname, ", ext:", ext);
            if (ext === '.md' || ext == '.markdown') {
                let file = replaceAll( "\\", "/",path.relative(__dirname, pathname));
                let dir = replaceAll( "\\", "/",path.dirname(path.relative(__dirname, pathname)));
                let hash = crypto.createHash('sha256');
                hash.update(file);
                let pIndex = hash.digest('hex').substr(0, 8);

                file = replaceAll("../", "/", file);
                dir = replaceAll("../", "/", dir);

                let post = {
                    "title": fileName.replace(ext, ""),
                    "file": file,
                    "dir": dir,
                    "p": pIndex,
                    "tags": []
                };
                posts.push(post)
            }
        });
        resolve(posts);
    });
    return p;
}

travelPostDir("./posts/data/").then(function (posts) {
    var postsStr = JSON.stringify(posts, null, '\t');
    console.log("posts:", postsStr);
    var listJson = "./posts/index/list.json";
    fs.writeFile(listJson, postsStr, (err) => {
        if (err) throw err;
        console.log(`save ${listJson} success`);
    });
});
