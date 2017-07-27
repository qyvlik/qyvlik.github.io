let fs = require('fs');
let path = require('path');

function travel(dir, callback) {

    callback = callback || function(pathname){};

    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);

        if (fs.statSync(pathname).isDirectory()) {
            travel(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}

module.exports=travel;
