# QtQuick 技巧 2

## QtQuick 与 Java Web 通信问题

Java Web 中，在 `post` 方法下，如果  `request.getParameter` 获取为 null，注意**设置客户端请求头** `setRequestHeader("Content-Type", "application/x-www-form-urlencoded");`。

## 生成 uuid 

```
// Generate four random hex digits.
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};
// Generate a pseudo-GUID by concatenating random hexadecimal.
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};
```

[js生成uuid的方法](http://ju.outofmemory.cn/entry/77339)

## QtQuick 中格式化日期

### 将 TimeStamp 格式化

直接上码

```
var timestamp = new Date(Number("1462430179000"));
console.log(Qt.formatTime(timestamp, "hh:mm") + " " + Qt.formatDate(timestamp, "M月d号"));
console.log(Qt.formatDateTime(d, "hh:mm M月d号"));
```

打印

```
qml: 14:36 5月5号
qml: 14:36 5月5号
```

可以直接使用 `Qt.formatDateTime` 这个函数。

> 这里要注意的是，`Qt.formatTime` 与 `Qt.formatDate` 的区别，一个可以格式化时间，但是不能格式化日期，另一个反之。

## 注意大小写

```
import "component"
Item {}
```

如上代码，如果本地路径是 `Component`，在 `qml` 文件中引入的时候就会出错，具体表现是，程序没有任何界面。换成调试模式，就会提示断言失败，但是在比较新的 Qt 版本中处理了这个问题。

## 类型的循环引用

QML 的类型是要进行完整定义后才可以使用的。不像 C++ 那样，可以进行前置声明和指针解除类型循环引用。

如果产生了循环引用，一般有如下表征：

1. 具现的循环引用，会在编译阶段报错。例如

```
// A.qml
Item {
    property B b
}

// B.qml
Item {
    property A a
}
```

使用 `qmlsecen A.qml` 报错 `qmlscene.exe exited with code -1`（`qmlsecen B.qml` 类似）。

把 `A` 或者 `B` 这些具体类型替换为 `var` 或者 `Item` 亦或者 `QtObject`。

2. 预编译引用

```
// A.qml
Item {
    Component {
        id: com
        B{}
    }
    function doCom() {
        console.log(com)
    }
}


// B.qml

Item {
    Component {
        id: com
        A{}
    }
    function doCom() {
        console.log(com)
    }
}

```

由于使用了 `Component` 实例化某个具体控件，然后这个具体控件又被其他所依赖的控件**预编译**。造成了类型的循环引用。

集体解决就是使用 `Qt.createComponent` 这个函数代替，动态生成 `Component`。

## 在 TextField 实现 `@` 功能

```
import QtQuick 2.5
import QtQuick.Controls 1.3
import QtQuick.Layouts 1.1

ApplicationWindow {
    visible: true
    width: 640
    height: 480
    title: qsTr("At Function")

//    menuBar: MenuBar {
//        Menu {
//            title: qsTr("File")
//            MenuItem {
//                text: qsTr("&Open")
//                onTriggered: console.log("Open action triggered");
//            }
//            MenuItem {
//                text: qsTr("Exit")
//                onTriggered: Qt.quit();
//            }
//        }
//    }

    ColumnLayout {
        width: parent.width
        height: parent.height
        TextField {
            id: textField
            Layout.fillWidth: true

            onCursorRectangleChanged: {
                if(textField.text[textField.text.length-1] === "@" && cursorPosition === length)  {
                    openMenu();
                }
            }

            function openMenu () {
                console.log("y:", textField.y);
                console.log("textField.height:", textField.height);

                var rect = Qt.rect(textField.cursorRectangle.x,
                                   textField.y+textField.height,
                                   textField.width,
                                   textField.height);
                menuHandle.__popup(rect, 0, MenuItemType.Menu);
            }

            Menu {
                id: menuHandle
                title: "Edit"
            }

            Component.onCompleted: {
                var iter = 0;
                for(iter =0; iter<10; iter++) {
                    var menuItem = menuHandle.insertItem(0, "第"+iter+"个人");
                    menuItem.triggered.connect(function(){
                        console.log("menuItem:", menuItem, " title:",menuItem.text);
                        textField.insert(textField.cursorPosition, menuItem.text);
                    });
                }
            }
        }
        Item { Layout.fillHeight: true }
    }
}
```

## QML 与 C++ 交互笔记

尽量减少使用 `QList` 作为交互类型，容易出现内存泄露。

使用 `QJsonArray` 或者 `QJsonObject` 代替结构体以及序列。除非交互的类型不是 `POJO` 。

> `POJO` 是简单对象的意思，一般除了属性，不应该带有复杂的方法。

---

[QML中多样化的ListModel(MultiDelegate)](http://www.cnblogs.com/dyllove98/p/3149666.html)

[QT QML目录导航列表视图](http://www.cnblogs.com/surfsky/p/4191994.html)

[Qt qml listview 列表视图控件（下拉刷新、上拉分页、滚动轴）](http://www.cnblogs.com/surfsky/p/4352898.html)

[qml json 解析到 ListView](http://www.cnblogs.com/xianqingzh/p/4335061.html)
