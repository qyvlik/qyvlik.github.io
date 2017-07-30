# QML 中的 XMLHttpRequest 对象

QML 中的 `XMLHttpRequest` 没有**同源限制**，并且可以**读写**本地文件。

代码如下：

```
function saveText(filename, contentText) {
    var xhr = new XMLHttpRequest;
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.HEADERS_RECEIVED) {
            console.log(xhr.getAllResponseHeaders());
        } else if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log(xhr.getAllResponseHeaders());
        }
    };
    xhr.open("PUT", filename);
    xhr.send(contentText.toString());
    xhr.open("PUT", filename);
    xhr.send(contentText.toString());
}
```

> note: 注意，需要两次执行两次 `open` 和 `send`，HTTP 方法为 `PUT`。

但是 `QML` 中只实现了 **XMLHttpRequest Level 1** 标准。

如下源码来自 `Qt` 的 `qml` 模块，此函数的功能就是过滤 `setRequestHeader` 设置的请求头。

其中 `COOKIE`，`COOKIE2` 等不能被设置，更多被过滤的请求头，查看下面的源码。

```
ReturnedValue QQmlXMLHttpRequestCtor::method_setRequestHeader(CallContext *ctx)
{
    Scope scope(ctx);
    Scoped<QQmlXMLHttpRequestWrapper> w(scope, ctx->thisObject().as<QQmlXMLHttpRequestWrapper>());
    if (!w)
        V4THROW_REFERENCE("Not an XMLHttpRequest object");
    QQmlXMLHttpRequest *r = w->d()->request;

    if (ctx->argc() != 2)
        V4THROW_DOM(DOMEXCEPTION_SYNTAX_ERR, "Incorrect argument count");

    if (r->readyState() != QQmlXMLHttpRequest::Opened || r->sendFlag())
        V4THROW_DOM(DOMEXCEPTION_INVALID_STATE_ERR, "Invalid state");

    QString name = ctx->args()[0].toQStringNoThrow();
    QString value = ctx->args()[1].toQStringNoThrow();

    // ### Check that name and value are well formed

    QString nameUpper = name.toUpper();
    if (nameUpper == QLatin1String("ACCEPT-CHARSET") ||
        nameUpper == QLatin1String("ACCEPT-ENCODING") ||
        nameUpper == QLatin1String("CONNECTION") ||
        nameUpper == QLatin1String("CONTENT-LENGTH") ||
        nameUpper == QLatin1String("COOKIE") ||
        nameUpper == QLatin1String("COOKIE2") ||
        nameUpper == QLatin1String("CONTENT-TRANSFER-ENCODING") ||
        nameUpper == QLatin1String("DATE") ||
        nameUpper == QLatin1String("EXPECT") ||
        nameUpper == QLatin1String("HOST") ||
        nameUpper == QLatin1String("KEEP-ALIVE") ||
        nameUpper == QLatin1String("REFERER") ||
        nameUpper == QLatin1String("TE") ||
        nameUpper == QLatin1String("TRAILER") ||
        nameUpper == QLatin1String("TRANSFER-ENCODING") ||
        nameUpper == QLatin1String("UPGRADE") ||
        nameUpper == QLatin1String("USER-AGENT") ||
        nameUpper == QLatin1String("VIA") ||
        nameUpper.startsWith(QLatin1String("PROXY-")) ||
        nameUpper.startsWith(QLatin1String("SEC-")))
        return Encode::undefined();

    r->addHeader(name, value);

    return Encode::undefined();
}
```

如有需求，可参照 `XMLHttpRequest` 接口可以设计一个支持更多必要功能的 `C++` 类。

[W3C XMLHttpRequest 标准](http://www.w3.org/TR/XMLHttpRequest/)。

`XMLHttpRequest` 的 W3C 接口描述如下：

```
[NoInterfaceObject]
interface XMLHttpRequestEventTarget : EventTarget {
    // event handlers
    attribute EventHandler onloadstart;
    attribute EventHandler onprogress;
    attribute EventHandler onabort;
    attribute EventHandler onerror;
    attribute EventHandler onload;
    attribute EventHandler ontimeout;
    attribute EventHandler onloadend;
};

interface XMLHttpRequestUpload : XMLHttpRequestEventTarget {

};

enum XMLHttpRequestResponseType {
    "",
    "arraybuffer",
    "blob",
    "document",
    "json",
    "text"
};

[Constructor]
interface XMLHttpRequest : XMLHttpRequestEventTarget {
    // event handler
    attribute EventHandler onreadystatechange;

    // states
    const unsigned short UNSENT = 0;
    const unsigned short OPENED = 1;
    const unsigned short HEADERS_RECEIVED = 2;
    const unsigned short LOADING = 3;
    const unsigned short DONE = 4;
    readonly attribute unsigned short readyState;

    // request
    void open(ByteString method, [EnsureUTF16] DOMString url);
    void open(ByteString method, 
             [EnsureUTF16] DOMString url, 
             boolean async, 
             optional [EnsureUTF16] DOMString? username = null, 
             optional [EnsureUTF16] DOMString? password = null);
    void setRequestHeader(ByteString header, ByteString value);
    attribute unsigned long timeout;
    attribute boolean withCredentials;
    readonly attribute XMLHttpRequestUpload upload;
    void send(optional (ArrayBufferView or Blob or Document or [EnsureUTF16] DOMString or FormData)? data = null);
    void abort();

    // response
    readonly attribute unsigned short status;
    readonly attribute ByteString statusText;
    ByteString? getResponseHeader(ByteString header);
    ByteString getAllResponseHeaders();
    void overrideMimeType(DOMString mime);
    attribute XMLHttpRequestResponseType responseType;
    readonly attribute any response;
    readonly attribute DOMString responseText;
    readonly attribute Document? responseXML;
};
```

已完成 [qyvlik/HttpRequest](https://github.com/qyvlik/HttpRequest)。
