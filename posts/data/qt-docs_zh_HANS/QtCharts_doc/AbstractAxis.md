# AbstractAxis QML 类型翻译

> 翻译 [qyvlik](http://blog.qyvlik.space)

> 这里去除了重复的文档。

`AbstractAxis` 是图表视图中轴的抽象。

## 属性

+ `alignment` : `alignment`

+ `color` : `color`

+ `gridVisible` : `bool`

+ `labelsAngle` : `int`

+ `labelsColor` : `color`

+ `labelsFont` : `Font`

+ `labelsVisible` : `bool`

+ `lineVisible` : `bool`

+ `minorGridVisible` : `bool`

+ `orientation` : `Qt.Orientation`

+ `reverse` : `bool`

+ `shadesBorderColor` : `color`

+ `shadesColor` : `color`

+ `shadesVisible` : `bool`

+ `titleFont` : `Font`

+ `titleText` : `String`

+ `titleVisible` : `bool`

+ `visible` : `bool` 

## 详细描述

每一个图表实体终归是要有一个垂直和水平的轴线的。

轴的属性，如轴线、 标题、 标签、 网格线和阴影，以及各种轴元素的可见性，都可以单独控制。

## 属性文档

+ `alignment` : `alignment`

    轴的对齐方式，有如下取值：

    + `Qt.AlignLeft`

    + `Qt.AlignRight`

    + `Qt.AlignBottom`

    + `Qt.AlignTop`

+ `color` : `color`

    轴和轴上刻度的颜色。

+ `gridVisible` : `bool`

    是否展示网格。

+ `labelsAngle` : `int`

    轴与轴上展示刻度文字所成角度。

+ `labelsColor` : `color`

    轴上刻度的颜色。

+ `labelsFont` : `Font`

    轴上刻度的字体。

+ `labelsVisible` : `bool`

    是否显示轴上刻度。

+ `lineVisible` : `bool`

    是否展示轴线。

+ `minorGridVisible` : `bool`

    次要网格线的可见性。只能应用于 `QValueAxis`

+ `orientation` : `Qt.Orientation`

    轴的方向。当轴设置为一系列固定到 `Qt.Horizontal` 或 `Qt.Vertical`。

+ `reverse` : `bool`

    是否使用反向轴。只支持线性，样条，离散点，区域图。All axes of the same orientation attached to same series must be reversed if one is reversed or the behavior is undefined.

+ `shadesBorderColor` : `color`

    轴色调的边框的颜色。

+ `shadesColor` : `color`

    轴色调的填充的颜色。

+ `shadesVisible` : `bool`

    The visibility of the axis shades.

+ `titleFont` : `Font`

    轴的标题字体。

+ `titleText` : `String`

    轴的标题。

+ `titleVisible` : `bool`

    是否显示轴的标题。

+ `visible` : `bool` 

    是否显示轴。
