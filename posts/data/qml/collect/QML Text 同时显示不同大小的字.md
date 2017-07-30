# QML Text 同时显示不同大小的字

> 作者 [qyvlik](http://blog.qyvlik.space)

直接上代码。

```
Text {
    text: '<font size="-1">-7</font>
            <font size="5">10</font>'
    textFormat: Text.RichText
    font.pixelSize: 30
    font.family: "微软雅黑"
}
```

直接查看 `HTML font` 便签的文档。

主要有 `color`，`face`，`size` 三个属性。

~~主要先看 `size` 属性，由于在 QML 中 直接设置两个 `font` 元素的size 同时为正，不能直接显示不同的大小。（bug？）~~

~~例如下列的 `html` 字符串在 `Text` 中就无法直接显示出不同的大小~~

```html
<font size="5">5</font>
<font size="10">10</font>
```

要使上诉代码在 `Text` 正确生效，必须设置 `textFormat: Text.RichText`。其他属性可以忽略。如果想要他们的绘制大小有所变化，可以直接设置 `Text.font.pointSize`，这个属性相当于一个比例系数。

显示效果如下

<font size="5">5</font>
<font size="10">10</font>
