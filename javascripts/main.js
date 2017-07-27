var postSet = {};
var postSetByTitle = {};
var postList = [];

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
    xhr.open(method, url);
    xhr.send();
}

function md2html(md) {
    var converter = new showdown.Converter(),
        html = converter.makeHtml(md);
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
            postSetByTitle[post.title] = post;
        }

        callback();
    });
}

function showPostList(htmlId) {
    var indexMarkdown = "# [qyvlik 的博客](/)\n\n";
    for (var iter in postList) {
        var post = postList[iter];
        var postUrl = encodeURI("/?p=" + post.p + "&title=" + post.title);
        var postListItem = "- [" + post.title + "](" + postUrl + ")\n";
        indexMarkdown += postListItem;
    }
    document.getElementById(htmlId).innerHTML = md2html(indexMarkdown);
}

function loadPost(htmlId, file) {
    ajax("GET", file, function (xhr) {
        document.getElementById(htmlId).innerHTML = md2html(xhr.responseText);
    });
}

function loadPostByP(htmlId, p) {
    var post = postSet[p];

    if (typeof post === 'undefined') {
        document.getElementById(htmlId).innerHTML = md2html("# not found\n [go back home](/)");
        return;
    }

    var url = post.file;
    loadPost(htmlId, url);
}

function loadPostByTitle(htmlId, title) {
    console.log("title:", title, ",decodeURI(title):", decodeURI(title)
    );
    var post = postSetByTitle[decodeURI(title)];
    if (typeof post === 'undefined') {
        document.getElementById(htmlId).innerHTML = md2html("# not found\n [go back home](/)");
        return;
    }
    var url = post.file;
    loadPost(htmlId, url);
}


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}