var postSet = {};
var postSetByFile = {};
var postList = [];
var postSetByDir = {};

function ajax(method, url, callback, error) {
    callback = callback || function (xhr) {
         console.log("xhr.responseText.length: ", xhr.responseText.length);
    };
    error = error || function (xhr) {
        console.log("xhr.responseText.length: ", xhr.responseText.length);
    };

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(xhr);
        }
        if (xhr.status > 300) {
            error(xhr);
        }
    };
    // console.log(method, " url:", url);
    xhr.open(method, url);
    xhr.send();
}

function md2html(md) {
    var converter = new showdown.Converter();
    converter.setOption('tables', true);
    converter.setOption('openLinksInNewWindow', true);
    var html = converter.makeHtml(md);
    return html;
}

function lostPostList(callback) {
    callback = callback || function () {};

    var indexMarkdown = "# [qyvlik 的博客](/)\n\n";

    ajax("GET", "/posts/index/list.json", function (xhr) {
        postList = JSON.parse(xhr.responseText);
        for (var iter in postList) {

            var post = postList[iter];
            postSet[post.p] = post;
            postSetByFile[post.file] = post;

            if (typeof postSetByDir[post.dir] === "undefined") {
                postSetByDir[post.dir] = [];
            }

            postSetByDir[post.dir].push(post);
        }

        callback();
    });
}

function showPostList(htmlId) {
    var indexMarkdown = "# [qyvlik 的博客](/)\n\n";

    for (var dirIter in postSetByDir) {
        var postDir = postSetByDir[dirIter];
        var postDirItem = "- " + dirIter.replace("./", "").replace("/", "").replace("posts/data/", "") + "\n";
        indexMarkdown += postDirItem;
        for( var postIter in postDir) {
            var post = postDir[postIter];
            var postUrl = encodeURI("/?p=" + post.p + "&title=" + post.title);
            var postListItem = "    - [" + post.title + "](" + postUrl + ")\n";
            indexMarkdown += postListItem;
        }
    }

    document.getElementById(htmlId).innerHTML = md2html(indexMarkdown);
}

function loadPost(htmlId, file, post) {
    ajax("GET", file, function (xhr) {
        document.getElementById(htmlId).innerHTML = md2html(xhr.responseText);

        var imgList = document.getElementsByTagName("img");

        // console.log("loadPost imgList.length: ", imgList.length);

        for(var iter in imgList) {
            var img = imgList[iter];
            var src = img.src;
            if (typeof src === 'undefined') {
                continue;
            }
            src = src.replace("http://", "").replace("https://", "");
            img.src = post.dir + src.substr(src.indexOf("/"));
        }

        var aList = document.getElementsByTagName("a");

        for(var iter1 in aList) {
            var a = aList[iter1];
            var href = a.href;
            if (typeof href === 'undefined') {
                continue;
            }
            href = href.replace("http://", "").replace("https://", "");
            var hrefIndexOf = href.indexOf("/");
            if (hrefIndexOf === href.length-1) {
                continue;
            }
            console.log("hrefIndexOf:", hrefIndexOf, " href.length:",  href.length, ", href:", href);
            var file =  post.dir + href.substr(href.indexOf("/"));
            console.log("file:", file);
            var postFromTitle = postSetByFile[file];
            a.href = "/?p=" + postFromTitle.p + "&title=" + postFromTitle.title;
        }
    });
}

function loadPostByP(htmlId, p) {
    var post = postSet[p];

    if (typeof post === 'undefined') {
        document.getElementById(htmlId).innerHTML = md2html("# not found\n [go back home](/)");
        return;
    }

    var url = post.file;
    loadPost(htmlId, url, post);
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}