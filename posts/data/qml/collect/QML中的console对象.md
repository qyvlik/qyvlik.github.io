# QML中的console对象

> 作者 [qyvlik](http://blog.qyvlik.space)

`console` 这个对象，有 `log`，`info`，`debug`，`error`，`trace` 等不同日志等级的打印函数。

这些函数，如果传入的参数是一个字符串，并且字符串的长度太长（超过 70000 个字节），就不会在控制台中打印出来。

---

[Qt：重定向QDebug输出到文件，并附上日期](http://blog.csdn.net/wsj18808050/article/details/53954537)
