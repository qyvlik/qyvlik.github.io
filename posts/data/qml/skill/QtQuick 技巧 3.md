# QtQuick 技巧 3

## 使用默认属性自定义控件

1. 自定义的qml控件，实例化后，就可以包含其他 qml 类。

2. 自定义的qml控件内部一般有布局和结构。

3. qml 控件一般有 父子关系

4. 可以使用默认属性修改自定义控件的父子关系。

5. 如下实例

    ```
    Item {
        default property alias data: row.data
        Row { id: row }
    }
    ```
    
    那么这个控件实例化后的名字为 RowItem 
    
    ```
    RowItem {
        id: rowItem
        Item {} // parent is row, not rowItem
        Item {} // parent is row, not rowItem
    }
    ```

## 竖排文本

```
import QtQuick 2.5

Item {
    width: 400
    height: 400

    FontMetrics {
        id: metrics
        font: textView.font
    }

    Text {
        id: textView
        text: "文字是竖排的"
        width: metrics.averageCharacterWidth
        verticalAlignment: Text.AlignVCenter
        horizontalAlignment: Text.AlignHCenter
        wrapMode: Text.WordWrap
        anchors.centerIn: parent
    }
}
```

只能通过**文本换行**来实现。（注意文本换行 `wrapMode`，必须指定文本的宽度）。

## QML 多窗体

```
QtObject {
       property list<QtObject> windows: [
         Window{}
         Window{}
         Window{}
         Window{}
         Window{}
         Window{}
         Window{}
       ]
}
```

## 避免在指定时间段内重复触发点击事件

```
import QtQuick 2.0

MouseArea {
    property real internal: 500
    property double __clickedTime: new Date().getTime()
    property double __clickedTimes: 0
    signal validClicked()

    onValidClicked: {
        console.log("validClicked")
    }

    onClicked: {

        var old = __clickedTime;
        var current = new Date().getTime();
        var offest = current-old
        if(offest >= internal) {
            __clickedTimes = 0;
            validClicked();
        } else {
            __clickedTimes+=offest;
            if(__clickedTimes > 500) {
                console.log("__clickedTimes", __clickedTimes)
                __clickedTimes = 0;
                validClicked();
            }
        }
        __clickedTime = current;
    }
}
```

## 纯 QtQuick 实现点击涟漪特效

```
//~ Ripple.qml
//! [code from](https://github.com/wyl8899/qml_exercise/tree/master)
import QtQuick 2.0

Item {
    id: ripple

    anchors.fill: parent

    property alias clip: backgroundLayer.clip
    property real radius: 0
    property color color: "#22000000"
    property real maxRadius: parent
                             ? Math.sqrt(parent.width * parent.width + parent.height * parent.height)
                             : Math.sqrt(width * width + height * height)
    property real radiusAnimationRate: 0.048
    property real radiusTailAnimationRate: 0.48
    property real opacityAnimationDuration: 800

    readonly property real diameter: radius * 2
    property real centerX
    property real centerY

    Connections {
        target: ripple.parent
        ignoreUnknownSignals: true

        onPressed: {
            start(mouse);
        }

        onReleased: {
            stop();
        }

        onExited: {
            stop();
        }

        onCanceled: {
            stop();
        }
    }

    state: "NORMAL"

    states: [
        State { name: "NORMAL" },
        State { name: "ACTIVE" }
    ]

    function start(mouse) {
        ripple.state = "ACTIVE";
        ripple.centerX = mouse.x;
        ripple.centerY = mouse.y;
    }

    function stop() {
        ripple.state = "NORMAL";
    }


    Rectangle {
        id: backgroundLayer
        anchors.fill: parent
        color: "transparent"
        clip: true

        Rectangle {
            id: circle
            x: ripple.centerX - ripple.radius
            y: ripple.centerY - ripple.radius
            height: diameter; width: diameter
            radius: ripple.radius
            color: ripple.color
        }
    }

    transitions: [
        Transition {
            from: "NORMAL"; to: "ACTIVE"
            SequentialAnimation {
                ScriptAction {
                    script: {
                        ripple.opacity = 1;
                    }
                }
                NumberAnimation {
                    id: radius_animation
                    target: ripple; properties: "radius"
                    from: 0; to: maxRadius
                    duration: maxRadius / radiusAnimationRate
                    easing { type: Easing.OutQuad }
                }
            }
        },
        Transition {
            from: "ACTIVE"; to: "NORMAL"
            ParallelAnimation {
                NumberAnimation {
                    id: radius_tail_animation
                    target: ripple; properties: "radius"
                    to: maxRadius
                    duration: maxRadius / radiusTailAnimationRate
                    easing { type: Easing.Linear }
                }
                NumberAnimation {
                    id: opacity_animation
                    target: ripple; properties: "opacity"
                    to: 0
                    duration: opacityAnimationDuration
                    easing { type: Easing.InQuad }
                }
            }
        }
    ]
}
```

使用：

```
MouseArea {
    Ripple { }
}
```

---

[JS 字符串操作函数 往指定位置插入字符 删除指定位置字符 替换指定位置字符](http://blog.csdn.net/yeping090815/article/details/45191411)