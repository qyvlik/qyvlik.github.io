# Qt for Android 开发大坑3

## 退至后台切回僵死

qt for android，app被按home推到后台，过一段时间再resume，有几率变成 freezing 状态，屏幕黑掉，失去响应。

> Qt for android 的机制问题，支撑 Qt for Android 的那个 Activity 被销毁后，然后重新载入出现了问题，无法再次初始化 Qt 的运行上下文。

[Qt application freezes after wakeup on android](https://bugreports.qt.io/browse/QTBUG-44339)

应用退至后台时会触发 `Qt.application.stateChanged` 信号，当 `Qt.application.state` 不等于 `Qt.ApplicationActive` 时，记得保存应用当前的状态和正在运行的任务。

## 华为手机进入工程模式

[ubuntu14.04中搭建qt for android环境](http://blog.csdn.net/u012160436/article/details/50640626)一文描述的华为手机进入工程模式的代码，对有些华为手机无效的。

## 安卓文本框

现阶段，Qt 没有直接提供文本框的复制粘贴。

## 安卓 4 上使用 Qt 的多媒体框架出现奔溃

安卓版本 4.4 或者 4.2.2.

在 `pro` 文件中注意模块添加的顺序。

> pro文件里面 += quick 放在 multimedia 前面。——上海Qt开发群群友。

## ListView 在安卓上，滑动速度为线性

> 此问题在 Qt 5.7.0 上已经解决，Qt 5.6 没有测试。

> `ListView` 在手机上有拖慢的现象。感觉总是没有Android原生系统那么流畅。——上海Qt开发群群友。

这里给一个简单的示例：

```
ListView {
    delegate: Rectangle {
         Text { anchors.centerIn: parent; text: index }
    }
    model: 20
}
```

然后在安卓上运行，运行时，进行操作，上下滑动这个列表，你会发现一些细节：

1. 滑动速度为线性的

2. 没有类似先加速然后减速的表现。

这里要设置 `ListView` 的什么属性，让其滑动速度随用户的滑动方式，做出一些响应呢？例如用户快速滑动时，ListView 的滑动速度先上升后下降。

[此问题讨论地址](http://qtdream.com/topic/551/listview-%E5%9C%A8%E5%AE%89%E5%8D%93%E4%B8%8A-%E6%BB%91%E5%8A%A8%E9%80%9F%E5%BA%A6%E4%B8%BA%E7%BA%BF%E6%80%A7)。

## adb 问题

[adb server is out of date. killing完美解决 ](http://blog.csdn.net/liranke/article/details/42524851)

[Failure [INSTALL_FAILED_UPDATE_INCOMPATIBLE] ](http://blog.csdn.net/hudashi/article/details/6877304)

主要是 apk 报名问题。

> PS 或者直接修改你的包名
