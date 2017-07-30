# Qt for Android 开发大坑

> 作者: qyvlik

> Qt 5.5.1

这里说一说比较常见的 Qt 开发安卓的大坑。希望同学们不要做无谓的挣扎，跳过这些坑。

## 输入框

首当其冲的是输入框，Qt 的输入在安卓上表现不佳.

1. 无法支持安卓原生的输入法访问 Qt 的输入框，就是安卓输入法无法复制，粘贴，剪切 Qt 输入框中的文本。

2. 无法支持使用触摸的方式选中 Qt 输入框中的文字。

3. 如果输入框的位置处于应用底部，类似于 IM 那种聊天工具，应当注意。

    a. 如果应用 `Activity` 设置为 `android:windowSoftInputMode="adjustResize"`，弹出输入法时，应用界面就会进行缩放，这个时候，应用界面就会闪烁。

    b. 如果应用 `Activity` 设置为 `android:windowSoftInputMode="adjustPan"`，应用界面的头部就会被顶出屏幕。

4. 为了修复上诉的问题，参照如下步骤

    a. 先设置应用 `Activity` 设置为 `android:windowSoftInputMode="adjustPan"`，这样，弹出输入法时，就不因为界面缩放而闪烁。

    b. 获取到安卓输入法高度。

    c. 修改输入框，使其被点击获取焦点之前，先弹出输入法（`Qt.inputMethod.show()`），由于不是输入框获取焦点而弹出输入发，所以界面既不会闪烁，也不会相对屏幕向上位移。（就是在 `TextField` 上放一个 `MouseArea`）

    d. 在输入法弹出后，就可以获取键盘高度（如果在安卓上获取键盘高度，是需要写一些 Java 代码的）。

    e.  获取到键盘高度后，直接位移输入框（延时处理），然后 `forceActiveFocus` 强制获取焦点。

5. 上诉解决方案又引发一个问题，且听我细细道来。

    a. 首先 `Qt.inputMethod.show()` 在安卓上可以直接显示键盘，然后显示时不会直接缩放界面（造成闪烁）或者将界面顶出屏幕。

    b. 接着，输入框是一个特殊的控件，在输入框获取虚拟键的焦点后，安卓上的输入法会直接记住这个控件的位置。

    c. 再下一次直接调用 `Qt.inputMethod.show()` 时，会找到上一次获取焦点的输入框的位置，根据这个位置，弹出虚拟键破并将界面顶出屏幕，然后输入框才会拿到键盘高度，位移。

6. 为了再解决上诉的问题，还得记录下安卓上键盘的高度，然后根据键盘高度决定先使用 `Qt.inputMethod.show()` 弹出键盘，还是先位移输入框。

    **TODO**

已经具现化的解决方案[GDPURJYFS/WellChat](https://github.com/GDPURJYFS/WellChat/commit/a861ddfd961b4028068bf3ed91e8ea5a6b41b5f4)，演示视频[安卓修复键盘弹出界面不友善问题修复终版Demo](http://www.bilibili.com/video/av3485059/)。当然现在这些方案都有各种各样的问题，具体要做的，其实是希望官方修复**键盘弹出，界面缩放时闪烁**的这个问题。

> [Qt Android 键盘问题](http://qtdream.com/topic/567/qt-android-%E9%94%AE%E7%9B%98%E9%97%AE%E9%A2%98)

## 摄像头

Qt 安卓应用上的摄像头，如果直接使用 `QtMultimedia::Camera` 可能会出现无法很好对焦的情况，并且各个机型和不同版本系统上表现不一致，华为手机对 Qt 的支持不佳，问题会稍微多一些。

解决方法：

> 可以直接通过调用系统的摄像软件，具体参照[QtAndroid详解(3)：startActivity实战Android拍照功能](http://blog.csdn.net/foruok/article/details/43560437)，具体代码 [A-week-to-develop-android-app-plan/demos/CallNativeCamera](https://github.com/GDPURJYFS/A-week-to-develop-android-app-plan/tree/master/demos/CallNativeCamera)。

## SplashScreen

启动屏，据多数 Qter 反映，Qt 安卓应用启动时，会显示一个无内容，带有标题和应用 Icon 的黑色画面，无法直接预先显示 SplashScreen。

## 本地多媒体缩略图

网络资源可以通过现有的 C++ 接口进行优化，缓存。但是本地多媒体缩略图支持，需要自行构建一个好用的。

## 网页支持

Qt 对移动平台的网页支持，应该是试图通过在 `QtSurface` 上绘制原生网页进行支持，所以 Qt 的网页支持对于移动平台来说是很孱弱的。然后 QtWebEngine 是基于谷歌的 Chromium 的，Chromium 现在对 VS 编译支持最好，Chromium  对 MinGW 的支持基本是没有的。

> 现在 Qt 在手机设备上，使用 QtWebView 也就是在 QtSurface 上绘制原生网页作为 Qt 在移动端上网页的解决方案。

## 本地化地图

QtQuick 中是支持地图插件的，但是官方只是预制了 *here* 等几个国外的地图插件，百度地图只能自己去封装插件。

相关讨论[有关 QML QtLocation 的 Plugin 的使用问题](http://qtdream.com/topic/246/有关-qml-qtlocation-的-plugin-的使用问题)。
