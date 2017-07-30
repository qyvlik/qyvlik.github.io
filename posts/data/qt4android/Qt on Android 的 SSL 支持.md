## Qt on Android 的 SSL 支持

由于 `Android 7.0` 修改了一些依赖库的连接信息，且 Qt 本身不提供一些依赖库，例如 ssl 的依赖库。所以需要自行编译 ssl 给 Qt on Android 使用。

参考如下官方文档进行编译：[Adding OpenSSL Support for Android](http://doc.qt.io/qt-5/opensslsupport.html)

编译成功后，就会有两个 so 文件：`libcrypto.so` 和 `libssl.so` (如果嫌麻烦，可以点击[这里下载成品](http://download.csdn.net/detail/nnngo/9793173))。然后将 `so` 文件找个目录安放好，在 `pro` 文件写入 `so` 文件的相对路径，参考如下：

```
contains(ANDROID_TARGET_ARCH,armeabi-v7a) {
    ANDROID_EXTRA_LIBS = \
        $$PWD/../lib/openssl/libcrypto.so \
        $$PWD/../lib/openssl/libssl.so
}
```

[安卓 7.0 Qt 5.8 网络模块不能正常工作](http://qtdream.com/topic/941/%E5%AE%89%E5%8D%93-7-0-qt-5-8-%E7%BD%91%E7%BB%9C%E6%A8%A1%E5%9D%97%E4%B8%8D%E8%83%BD%E6%AD%A3%E5%B8%B8%E5%B7%A5%E4%BD%9C)

[QWebSocket for Android闪退问题](http://www.itwendao.com/article/detail/359652.html)

[[原创]改一个参数即可绕过 Android N 的私有 API 链接限制](http://bbs.pediy.com/thread-217877.htm)

[QNetworkAccessManager crashes with SIGSEGV on Android 7](https://bugreports.qt.io/browse/QTBUG-57922)

> 自 Android 6.0 起，正在从使用 OpenSSL 库转向使用 BoringSSL 库。如果您要在应用中使用 Android NDK，请勿链接到并非 NDK API 组成部分的加密库，如 libcrypto.so 和 libssl.so。参考[Android5,6,7,8新特性](http://blog.csdn.net/fanenqian/article/details/56479714)

> [QWebSocket-for-Android-openssl库下载](http://download.csdn.net/detail/nnngo/9793173)，**注意，so 文件来源自互联网，请勿将不明的 so 文件应用于生产环境！**
