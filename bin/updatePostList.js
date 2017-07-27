let travel = require("./travel.js");
let path = require('path');
let fs = require('fs');

function travelPostDir(postDir) {
    let p = new Promise(function (resolve, reject) {
        let posts = [];
        let pIndex = 0;
        travel(postDir, function (pathname) {
            let ext = path.extname(pathname).toLowerCase();
            let fileName = path.basename(pathname);
            // console.log("pathname:", pathname, ", ext:", ext);
            if (ext === '.md' || ext == '.markdown') {
                let post = {
                    "title": fileName.replace(ext, ""),
                    "file": path.relative("./", postDir + "/" + fileName),
                    "p": pIndex,
                    "tags": []
                };
                pIndex++;
                posts.push(post)
            }
        });
        resolve(posts);
    });
    return p;
}

travelPostDir("./posts/data/").then(function (posts) {
    console.log("post:", JSON.stringify(posts));
    var listJson = "./posts/index/list.json";
    fs.writeFile(listJson,  JSON.stringify(posts), (err) => {
        if (err) throw err;
        console.log(`save ${listJson} success`);
    });
});
