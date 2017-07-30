# QML 的 font 与 Canvas 的中 font 

> 作者 [qyvlik](http://blog.qyvlik.space)

QML 中的 Canvas 的 font 类型和 HTML CSS font 的类型一样，但是和 QML 本身的 font 不一样，所以需要做一个转换函数。

## QML 中的 font 有如下属性：

+ `string` font.family

+ `bool` font.bold

+ `bool` font.italic

+ `bool` font.underline

+ `real` font.pointSize

+ `int` font.pixelSize

+ `enumeration` font.weight

+ `bool` font.overline

+ `bool` font.strikeout

+ `enumeration` font.capitalization

+ `real` font.letterSpacing

+ `real` font.wordSpacing

## CSS font

> font 简写属性在一个声明中设置所有字体属性。

> 注释：此属性也有第六个值："line-height"，可设置行间距。

可以按顺序设置如下属性：

+ font-style

+ font-variant

+ font-weight

+ font-size/line-height

+ font-family

```
p.ex1
{
font:italic arial,sans-serif;
}

p.ex2
{
font:italic bold 12px/30px arial,sans-serif;
}
```

## QML font 到 CSS font 的转换

+ font-style（规定字体样式）

    normal, italic（斜体）, oblique（斜体），与 QML 的 `font.italic` 对应。

+ font-variant（规定字体异体）

    normal, small-caps ，与 QML 无对应关系，直接使用 `normal`

+ font-weight（规定字体粗细）

    normal（400）, bold（700）, bolder（更粗）, lighter（更细）, 100~900，与 QML 的 `font.bold` 以及 `font.weight`  QML 上的 字体宽度与 CSS 对应不太一致。

+ font-size

    与 QML 的 font.pixelSize 直接对应。

+ line-height

    与 FontMetrics::height 对应。但是 QML 中 Canvas 的 font 不支持此属性。
     
+ font-family

    与 QML font.family 对应。

    > font-family 可以把多个字体名称作为一个“回退”系统来保存。如果浏览器不支持第一个字体，则会尝试下一个。也就是说，font-family 属性的值是用于某个元素的字体族名称或/及类族名称的一个优先表。浏览器会使用它可识别的第一个值。

具体代码：

从 QML 到 CSS font 的转换：

```
    FontMetrics {
        id: fontMetrics

        function getFontToContext2D() {
            var cssFontString = "";
            if(fontMetrics.font.italic) {
                cssFontString += "italic ";
            } else {
                cssFontString += "normal ";
            }

            if(fontMetrics.font.bold) {
                cssFontString += "bold ";
            } else {
                cssFontString += "normal ";
            }

            cssFontString += (fontMetrics.font.pixelSize+"px ");
            // cssFontString += ("/"+fontMetrics.height+"px ");
            cssFontString += fontMetrics.font.family;
            return cssFontString;
        }
    }
```

---

[CSS font 属性](http://www.w3school.com.cn/cssref/pr_font_font.asp)