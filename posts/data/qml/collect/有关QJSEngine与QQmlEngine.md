# 有关QJSEngine与QQmlEngine

> 作者 [qyvlik](http://blog.qyvlik.space)

`QQmlEngine` 是继承自 `QJSEngine`，本身做了一些修改，例如添加 `console`，`Qt`，`XMLHttpRequest` 等全局对象，但是不允许添加新的全局对象。

而 `QJSEngine` 就可以操作全局对象。例如通过添加一些新的全局变量，来构建一个新的 `JSEngine`。

一个未经修改的 `QJSEngine` 的全局对象如下：

```
    QJSEngine jsEngine;
    QJSValue global = jsEngine.globalObject();
    QJSValueIterator it(global);
    while (it.hasNext()) {
        it.next();
        qDebug() << it.name() << ": " << it.value().toString();
    }
```

输出如下：

```
"Object" :  "function() { [code] }"
"String" :  "function() { [code] }"
"Number" :  "function() { [code] }"
"Boolean" :  "function() { [code] }"
"Array" :  "function() { [code] }"
"Function" :  "function() { [code] }"
"Date" :  "function() { [code] }"
"RegExp" :  "function() { [code] }"
"Error" :  "function() { [code] }"
"EvalError" :  "function() { [code] }"
"RangeError" :  "function() { [code] }"
"ReferenceError" :  "function() { [code] }"
"SyntaxError" :  "function() { [code] }"
"TypeError" :  "function() { [code] }"
"URIError" :  "function() { [code] }"
"ArrayBuffer" :  "function() { [code] }"
"DataView" :  "function() { [code] }"
"Int8Array" :  "function() { [code] }"
"Uint8Array" :  "function() { [code] }"
"Uint8ClampedArray" :  "function() { [code] }"
"Int16Array" :  "function() { [code] }"
"Uint16Array" :  "function() { [code] }"
"Int32Array" :  "function() { [code] }"
"Uint32Array" :  "function() { [code] }"
"Float32Array" :  "function() { [code] }"
"Float64Array" :  "function() { [code] }"
"Math" :  "[object Math]"
"JSON" :  "[object JSON]"
"undefined" :  "undefined"
"NaN" :  "NaN"
"Infinity" :  "Infinity"
"eval" :  "function() { [code] }"
"parseInt" :  "function() { [code] }"
"parseFloat" :  "function() { [code] }"
"isNaN" :  "function() { [code] }"
"isFinite" :  "function() { [code] }"
"decodeURI" :  "function() { [code] }"
"decodeURIComponent" :  "function() { [code] }"
"encodeURI" :  "function() { [code] }"
"encodeURIComponent" :  "function() { [code] }"
"escape" :  "function() { [code] }"
"unescape" :  "function() { [code] }"
```

通过设置全局对象的属性，设置一些有用的方法。

```
globalObject().setProperty(name, value);
```

使用 `newQObject` 来包装一个 `QObject` 对象或者其子类实例到这个 `QJSEngine`。

```
QJSValue object = jsEngine.newQObject(new QObject());
jsEngine.globalObject().setProperty("Q", object);
```

注意两个不同的 `QJSEngine` 所产生的 `QJSValue` 是不能互相串用的。
