# AbstractSeries QML 类型翻译

> 翻译：qyvlik

> 移除重复文档。

图表实体的抽象类。

## 属性

+ `name` : `string`

+ `opacity` : `real`

+ `type` : `ChartView.SeriesType`

+ `useOpenGL` : `bool`

+ `visible` : `bool` 

## 详细描述

`AbstractSeries` 是所有图表实体的基类。不能被实例化。

## 属性文档

+ `name` : `string`

    图表实体的名字。

+ `opacity` : `real`

    图表实体的透明度。

+ `type` : `ChartView.SeriesType`

    图表实体的类型。有如下取值：

    + `ChartView.ChartThemeBlueCerulean`
    
    + `ChartView.ChartThemeBlueIcy`
    
    + `ChartView.ChartThemeBlueNcs`
    
    + `ChartView.ChartThemeBrownSand`
    
    + `ChartView.ChartThemeDark`
    
    + `ChartView.ChartThemeHighContrast`
    
    + `ChartView.ChartThemeLight`
    
    + `ChartView.ChartThemeQt`

+ `useOpenGL` : `bool`

    是否使用 `OpenGL` 绘制图表实体。

    `LineSeries` 和 `ScatterSeries` 可以通过 `OpenGL` 加速绘制。`AreaSeries` 不可以使用 `OpenGL` 加速。图表实体在使用 `OpenGL` 加速时，会在 `ChartView` 的结点上添加透明的子结点。加速图表实体并不是在在 `ChartView` 的结点上绘制的，而是在子结点上进行绘制。

    使用 `OpenGL` 加速依赖于底层硬件，多数情况下加速效果是显著的。原文巴拉巴拉说了许多，有兴趣可以自己去看英文~

    有如下几点需要注意：

    + 图表实体的动画不能加速。

    + 抗锯齿不能加速

    + `Point labels` 不能加速。

    + Marker shapes are ignored for accelerated series. Only plain scatter dots are supported. The scatter dots may be circular or rectangular, depending on the underlying graphics hardware and drivers.

    + Polar charts do not support accelerated series.

    + Mouse events are not supported for accelerated series.

    + Enabling chart drop shadow or using transparent chart background color is not recommended when using accelerated series, as that can slow the frame rate down significantly.

    默认不使用。

+ `visible` : `bool` 

    是否可见。
