# Qt for Android 之 WebSocket

> Qt 5.5.1，Qt 5.8

> Android 5.1，Android 7.0

> m2 note, OnePlus3T

在安卓应用中使用 `WebSocket` 时提示 `Qt.WebScoket` 模块不存在，到 Qt 的安装目录下找到 `Qt5.5.1\5.5\android_armv7\qml\Qt\WebSockets` 发现里面只有一个 `qmldir` 文件，虽然这个文件内部标明了 `declarative_qmlwebsockets` 的路径。但是在发布到安卓上时提示模块不存在。

最简单的做法是将 `Qt5.5.1\5.5\android_armv7\qml\QtWebSockets` 下所有文件复制到 `Qt5.5.1\5.5\android_armv7\qml\Qt\WebSockets`（包括 qmldir）。在 **QtCreator** 打包 apk 的时候，会自动将这些文件打包。

这个是 `arm_v7` 的解决方式，其他 `arm_v5` 和 `x86` 框架同样适用。

其他解决方案

[Qt.WebSocket导致的部署失败及解决方案](https://my.oschina.net/jannn/blog/666284?fromerr=tGwuVspd)

> 如果你的应用闪退很可能是没有加入依赖包，[Qt on Android 的 SSL 支持](http://blog.csdn.net/qyvlik/article/details/73195506)