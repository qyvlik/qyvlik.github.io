# Qt 调用 Java 方法笔记

如果遇到类似的错误：

`error: undefined reference to '_jstring* QAndroidJniObject::callStaticMethod<_jstring*>(char const*, char const*)'`

那就是你使用了一个错误的函数来调用 Java 方法了。

> The main difference is that `QAndroidJniObject::callMethod` returns a primitive data type like `jint` or `jbyte` but `QAndroidJniObject::callObjectMethod` returns an object of type `QAndroidJniObject`.

> Using which one all depends on your needs and the return type of the function you want to call. If your function returns an object type like `jobject`, `jstring`, `jarray`,... then you should definitely use `QAndroidJniObject::callObjectMethod`. Otherwise you can use either of the two.

就是参照以调用的 Java 方法返回的对象来使用不同的函数，如果返回参数为对象例如是数组，字符串，就使用 `QAndroidJniObject::callObjectMethod`，如果是基本数据类型就使用 `QAndroidJniObject::callMethod`。

---

参考

[What is the difference between QAndroidJniObject::callMethod() and QAndroidJniObject::callObjectMethod()?](http://stackoverflow.com/questions/28832640/what-is-the-difference-between-qandroidjniobjectcallmethod-and-qandroidjniob)

[https://bugreports.qt.io/browse/QTBUG-37212](https://bugreports.qt.io/browse/QTBUG-37212)

[error: undefined reference to '_jstring* QAndroidJniObject::callStaticMethod<_jstring*>(char const*, char const*)'](http://stackoverflow.com/questions/27331347/error-undefined-reference-to-jstring-qandroidjniobjectcallstaticmethod-js)