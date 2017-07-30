# QML 中的 console 对象

> 作者 [qyvlik](http://blog.qyvlik.space)

`console.log()` 这个函数，如果传入的参数是一个字符串，并且字符串的长度太长（超过 70000 个字节），就会不打印出来~

但是 `JSON.parser()` 函数还是可以使用的。