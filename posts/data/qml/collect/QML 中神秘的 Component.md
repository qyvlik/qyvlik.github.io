# QML 中神秘的 Component

> 作者 [qyvlik](http://blog.qyvlik.space)

Component 类型的属性，会把所有 qmltype 转换为 Component 的闭包。既然是闭包，外部必然无法访问，但是内部可以访问外部变量。

在 ListView 中有个代理模式，其中最为重要的是名为 `delegate` 的属性。

通过设置 `delegate` 以不同的方式，展示数据项。可是你曾发现 `ListView::delegate` 的接口类型为 `Component`，却不是 `Item`。

下面通过一些代码为你一一道出 Component 不为人知的秘密

## Component 包裹对象的作用域

这里的作用域亦可是可被访问的范围。

```
import QtQuick 2.0

Item {
    //! [0]
    id: root
    
    Component {
        //! [1]
        id: com
        Text {
            //! [2]
            id: label
            text: "I am Text"
            //! [2]
        }
        //! [1]
    }
    
    Loader {
        anchors.fill: parent
        sourceComponent: com
    }
    //! [0]
}
```

如上诉代码，其中有三个可访问的标识符：`root`，`com`，`label`。`root` 在整个 `0` 是可以被访问的，`com` 访问域也是在整个 `0` 区。但是 `label` 只能在 `2` 区被访问。刚好被 `1` 给包裹了。

其实，`label` 就是作为 `com` 的模板对象（模板图元），构造对应的对象出来。

## Component 和 Loader 的配合

讲完之后。我们再来一次代码看一看。首先我们定义一个 `Panel`，如下：

```
//~ Panel.qml
import QtQuick 2.0

Rectangle {
    width: 100
    height: 100

    color: "transparent"
    border.color: "black"
    border.width: 1

    property Component label

    Loader {
        id: loader
        anchors.fill: parent
        anchors.margins: parent.width * 0.1
        sourceComponent: label
    }
}
```

这里的 `Loader` 会从 `label` 那里获取到一个模板图元，然后依据这个模板图元进行对象构建， `Loader` 作为父亲参数调用 `label` 的 `object Component::createObject(Item parent, object properties)` 函数，返回的对象设置给 `Loader::item` 属性。

当 `Loader::sourceComponent` 改变的时候，他会先销毁之前的根据 `label` 构建的对象，然后再重新构建新对象，设置到 `Loader::item`。

下面是 `Loader::setSourceComponent(Component c)` 的 `c++` 伪码：

```
void Loader::setSourceComponent(Component c)
{
    if(this.sourceComponent != c) {
        if(this.item != null) {
            this.item.deleteLater();
            this.item = null;
        }
        this.sourceComponent = c;
        emit this.sourceComponentChanged();             // 信号触发后，就构建新的对象到 this.item
    }
}
```

## Compoent 的自动装箱

测试代码如下：

```
import QtQuick 2.5

Item {
    width: 640
    height: 360

    Row {
        anchors.fill: parent

        Panel {
            id: panel1
            label: Component {
                id: greenCom
                Rectangle {
                    color: "green"
                    Component.onDestruction: {
                        console.log("Green Rectangle Destruction")
                    }
                }
            }
        }

        Panel {
            id: panel2
            label: Rectangle { color: "red" }
        }
    }
    Component {
        id: yellowCom
        Rectangle {
            color: "yellow"
        }
    }

    MouseArea {
        anchors.fill: parent
        onClicked: {
            panel1.label = yellowCom;
            if(time == 0) {
                console.log("set cache only once")
                cache = panel2.label;
            }
            panel2.label = yellowCom;
            ++time;
            console.log(cache, cache.progress)
        }
    }

    property int time: 0
    property var cache

    Component.onCompleted: {
        console.log(panel2.label)
    }
}
```

其中 `panel2` 的 `lable` 参数不是 `Component`，但是 Qt 会为其构建一个 `Component` 进行自动封装（不是类型转换，类似 Java 的装箱）。

当你修改 `panel2` 的 `lable` 属性时，跟前面所说的一样，旧的对象会被销毁，并被新的对象替代。同理，`panel1` 也是。

### 因为自动装箱而产生的 Component 回收情况

你会注意到，`panel2` 之前自动产生 `label` 对象保存在 `cache` 中，并没有被销毁（访问 `progress` 不报空指针异常）。也就是装箱产生的封装类，不会被马上回收。

> 由于是 Qt 自动生成的，所以其对象所有权应该属于 QmlEngine，在满足一些条件时会被自动回收。可以尝试使用 `ObjectOwnership QQmlEngine::objectOwnership(QObject * object)` 查询对象的所有权，这里没有进行测试，有空再说啦~

