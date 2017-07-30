# Qt for Android 开发大坑 2

## 华为

1. 使用自家的 `CPU` 的手机，在调试时无法将控制台输出输出到 **QtCreator**。

    解决华为手机无法连接上 **QtCreator**。

    > 打开**华为**手机拨号键盘界面，输入 `##2846579##` ，进入工程菜单，选择 后台设置->USB端口设置, 选择Google模式，之后重启手机。

    参考：[ubuntu14.04中搭建qt for android环境](http://blog.csdn.net/u012160436/article/details/50640626)

2. 无法使用 `grab` 来截取应用屏幕。

3. 使用 `QtWebView` 容易奔溃

4. android 的 sparc 架构类需要四个字节对齐

5. 写auto，会崩溃。。

6. `QTimer` 不能放在全局。

7. 在华为上 `Image` 设置的图片大小大于 1 MB 可能无法显示

> 机型：华为荣耀 7，分辨率 1080 p

## QtWebView 的奔溃问题

在安卓上使用 `QtWebView` 模块的 `WebView` 在退出时可能会崩溃。

试试将 `WebView` 的 `visible` 设置为 `false`。

## 视频播放问题

> 原生的 service 通过用 windowmanager 加一个 surfaceview 和 mediaplayer 播视频，播完，想销毁，无法隐藏。

> 待补充。

## androiddeployqt.exe 发布错误

> 在已经搭建好的Qt for Android环境上发布程序到Android系统上时提示“androiddeployqt.exe 退出代码 14”错误；
> 错误原因： ant工具(ant-1.8.4)与Android SDK版本(r24.3.4)不搭(ant版本过低)；
> 解决方法：后采用ant-1.9.4搭配Android SDK-r24.3.4解决上述问题。

[androiddeployqt.exe 退出代码 14解决方法](http://qtdream.com/topic/501/androiddeployqt-exe-%E9%80%80%E5%87%BA%E4%BB%A3%E7%A0%81-14%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95)

---

[在Qt5的QML中使用QZXing识别二维码](http://blog.csdn.net/zhx6044/article/details/44202667)

[QML怎么适配不同的设备](http://blog.csdn.net/zhx6044/article/details/44180819)

[Android系统input系统(1)](http://blog.csdn.net/zhx6044/article/details/50808163)

[为QNetworkAccessManager添加超时提醒](http://www.dushibaiyu.com/2014/10/qnetworkaccessmanager-timeout.html)

[qml+opencv（一）](http://blog.csdn.net/zhx6044/article/details/45031517)

[qml+opencv(二)](http://blog.csdn.net/zhx6044/article/details/45048765)

[qml+opencv(三)人脸检测与识别](http://blog.csdn.net/zhx6044/article/details/45649045)

[qml+QZXing实现实时QRCode识别和给重复造轮子的一些建议](http://blog.csdn.net/zhx6044/article/details/45292107)

[Qt mvc学习一](http://blog.csdn.net/zhx6044/article/details/9009117)

[Qt mvc二](http://blog.csdn.net/zhx6044/article/details/9025657)

[Qt mvc 三](http://blog.csdn.net/zhx6044/article/details/9037271)

[Qt mvc四](http://blog.csdn.net/zhx6044/article/details/9050311)

[Qt HTTP请求同步调用](http://blog.csdn.net/zhx6044/article/details/44598641)

[Qt HTTP内部构架](http://www.tuicool.com/articles/U7BBrm)