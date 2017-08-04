# QML中的屏幕适配问题

> 作者 [qyvlik](http://blog.qyvlik.space)

其实 `QML` 中的屏幕适配问题，官方也写了一篇文章，如何在不同分辨率下适配控件大小和图片大小（字体好像没有讲到）。虽然文章条理清晰，原理，案例都写得不错，但是总觉得缺点什么。对，就是代码，具体实现的代码。从头到尾，原理阐述清晰，唯独就是不写出具体的代码实现。

有人说，具体的代码实现可能很复杂。倒不至于，这里给出一段最简单的使用**纯 QML 实现的 `dp`**，至于 `dpi` 什么，管它呢。

```
import QtQuick.Window 2.0
import QtQuick 2.5

Item {
    property real dpScale:  1.5
    readonly property real dp: Math.max(Screen.pixelDensity * 25.4 / 160 * dpScale, 1)
}
```

> [代码来源](https://github.com/qyvlik/Sparrow.2/blob/master/src/Sparrow/Private/Container.qml#L25)

> **注意**：dpScale 可以自行修改。上诉代码仅仅是接近 `dp` 具体意义。此外 `dpi` 的取值在[另一篇博客](http://blog.csdn.net/qyvlik/article/details/51226005#t1)提及。

上述代码在我的 windows 7（屏幕 1080p 23.8 寸），安卓机魅蓝 note 2 上，有着不错的效果，测试的代码是：

```
Button {
    implicitWidth: 88 * dp
    implicitHeight: 48 * dp
}
```

至于**字体适配**，那是另外的话题了，**字体适配**是使用 `font.pointSize` 进行处理，至于字体大小单位 `sp` 的代码？

对不起，无（我）可（不）奉（知）告（道）。

另外强烈推荐商业化 app 使用 [v-play](http://v-play.net/) 这个框架。
