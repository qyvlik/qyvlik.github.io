# QML UI 布局

> 原文： csdn aidear_evo [QML UI 布局](http://blog.csdn.net/ieearth/article/details/41942245)

在 QML 应用程序中，布局无疑是一个非常重要的概念，QML 可视化元素的布局方式多种多样，经常用到的就是 anchors 锚布局，其它还有 Positioners、Layouts 等，下面一一介绍。

## 属性定位

如果说我们的 QML 元素位置是固定的，那么使用x、y属性进行布局要比其它布局方式更加直观、高效，这些属性值是个具体的坐标，也就是所谓的静态值，例子如下：

```
Rectangle {
    width: 360; height: 360
    color: "lightblue"

    Rectangle {
        width: 100; height: 100
        color: "red"

        Rectangle {
            x: 25; y: 25
            width: 50; height: 50
            color: "green"
        }
    }

    Rectangle {
        x: 100; y: 100
        width: 80; height: 80
        color: "yellow"
    }
}
```

上面几个彩色矩形的位置就是通过其x、y属性来设置的，比较简单。

## 属性绑定

一个对象的属性也可以与其它对象的属性绑定，当其它对象的属性改变时，这个对象的属性也会自动更新，在布局中绑定的就是 `x`、`y` 属性，这种布局方式常用于动态布局，当然动态布局也不仅限于这种方法，只是用起来比较简单而已，且看如下例子：

```
Rectangle {  
    width: 360; height: 360  
    color: "lightblue"  
  
    Rectangle {  
        id: rect  
        width: 100; height: 100  
        color: "red"  
  
        Rectangle {  
            x: parent.width / 2 - width / 2;  
            y: parent.height / 2 - height / 2;  
            width: 50; height: 50  
            color: "green"  
        }  
  
        MouseArea {  
            anchors.fill: parent  
            onClicked: {  
                parent.width += 10  
                parent.height += 10  
            }  
        }  
    }  
  
    Rectangle {  
        x: rect.width + 5; y: rect.height + 5  
        width: 80; height: 80  
        color: "yellow"  
    }  
}  
```

例子中，绿色矩形和黄色矩形的 `x`、`y` 坐标都绑定到了红色矩形的 `width`、`height` 上。

## Anchors 布局

每一个 `Item` 都可以假想有 7 条线，如下图所示：

![](images/QML UI 布局-001.png)

图中列出了 6 条线，还有一条是 `baseline`，是用于定位文本内容的，`baselineOffset` 用来设置偏移量，`horizontalCenterOffset` 和 `verticalCenterOffset` 同理。值得注意的是，锚布局只能用于其父对象或者兄弟对象，我们还可以通过 `AnchorChanges` 来改变锚布局状态，`AnchorAnimation` 设置动画，某个方向的属性值可以是 `undefined`，这时就移除了该方向上的 `anchors` 效果。

锚布局还提供了设置对象留白的属性，如下图所示：

![](images/QML UI 布局-002.png)

四个方向的留白可以单独设置，也可以由 `margins` 统一设置。

`anchors` 组属性除了上面所涉及的一些属性外，还有 `fill`,`centerIn`,`alignWhenCentered` 三个属性。

例子如下，展示了锚布局的大部分用法：

```
Item {  
    width: 360; height: 360  
  
    Rectangle {  
        id: container  
        anchors.fill: parent  
        color: "lightblue"  
  
        Component.onCompleted: state = "toRight"  
  
        Rectangle {  
            id: redRect  
            width: 50; height: 50  
            anchors.centerIn: parent  
            color: "red"  
        }  
  
        Rectangle {  
            id: yellowRect  
            width: 50; height: 50  
            anchors.right: parent.right  
            anchors.rightMargin: 5  
            anchors.bottom: parent.bottom  
            anchors.bottomMargin: 5  
            color: "yellow"  
        }   
          
        Rectangle {  
            id: greenRect  
            width: 50; height: 50  
            color: "green"  
        }  
  
        states: State {  
            name: "toRight"  
            AnchorChanges {  
                target: greenRect  
                anchors.right: parent.right  
            }  
        }  
  
        transitions: Transition {  
            AnchorAnimation { duration: 1000 }  
        }  
    }  
}  
```

## Positioners 定位

还有一些专门用于 UI 布局的定位器 Positioners，如 `Row`、`Column`、`Grid`、`Flow`，它们都继承自 `Item`，都可以使用 `Positioner.index/isFirstItem/isLastItem` 附加属性，用法比较简单，可查看Qt帮助文档。

`Row`—— 行布局。

`Column`—— 列布局。

`Grid`—— 网格布局，是 `Row` 和 `Column` 的集合。

`Flow`—— 流布局，类似于文本编辑中的自动换行。

## Layouts 布局

在 QML 文件中导入 `QtQuick.Layouts` 模块，还可以使用 `ColumnLayout`、`RowLayout`、`GridLayout` 进行动态布局，这里主要是使用了 `Layout` 提供的附加属性。另外，`LayoutMirroring` 可以给已有的布局设置一个镜像效果，这里就不再一一举例了。

## 高级应用

Qt Quick 还提供了一些便捷的模型与视图，也可用于 UI 布局，可参照：http://doc.qt.io/qt-5/qtquick-modelviewsdata-modelview.html#qml-data-models