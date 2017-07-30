# QtQuick 技巧 5

## 表单提交（不包括cookies）

```
function urlQuery(jsonObject) {
    var query = "";
    var i = 0;
    for(var iter in jsonObject) {

        if(i > 0) {
            query += "&";
        }
        query += iter +"=" + encodeURI(jsonObject[iter]);
        i++;
    }
    // console.log("url query:", query);
    return query;
}


function setHeader(xhr, headers) {
    //"Content-Type":"application/x-www-form-urlencoded"
    for(var iter in headers) {
        xhr.setRequestHeader(iter, headers[iter]);
    }
}

function ajax(method, url, headers, data, callable) {
    headers = headers || {};
    callable = callable || function(xhr) {
        console.log(xhr.responseText);
    }
    var xhr = new XMLHttpRequest;
    xhr.onreadystatechange = function() {
        if(xhr.readyState == xhr.DONE) {
            callable(xhr);
        }
    }
    xhr.open(method, url);
    setHeader(xhr, headers);
    if("GET" === method) {
        xhr.send();
    } else {
        xhr.send(data);
    }
}
```

## 不约进保留小数精度 `cutNumber`

```
function endNotOf(str, n) {
    var index = str.length - 1;
    while (index > 0) {
        if (str[index] != n) {
            break;
        }
        index--;
    }
    return index;
}

function toFixedNumber(number, precision) {
    precision = precision || 8;
    var numStr = new Number(number).toFixed(precision).toString(); // 处理科学计数法
    var index = endNotOf(numStr, "0") + 1;
    numStr = numStr.substr(0, index);
    if(numStr.lastIndexOf(".") == numStr.length-1) {
        numStr = numStr.substr(0, numStr.length-1)
    }
    return numStr;
}

function numberPrecision(number) {
    number = toFixedNumber(number);
    var numberStr = number.toString();
    try {
        return numberStr.split(".")[1].length;
    } catch (e) {
        return 0;
    }
}

function cutNumber(number, precision) {
    return toFixedNumber(number, precision);
}
```

