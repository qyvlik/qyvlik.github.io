# QML 中的默认属性

在讲默认属性前，先说一说  QML 对象本身具备什么东西。例如**属性**，**方法**，**信号**。

但是如果 QML 对象本身包含了另一个 QML 对象实体，这个对象实体该怎么归纳？

## QML 中的 `data` 链表属性

```
Item {
    id: root
    width: 100
    height: 100
    Item { 
        id: child
        width: 100
        height: 100
    }
}
```

上诉代码中，一个 `Item` 包含了另外一个 `Item`。这两个 `Item` 就形成了父子关系。其实就是将 `child` 归属到了 `root` 的 `data` 这个链表属性中。

也就是说，QML 对象中，所有的 QML 实体对象都会默认归属到一个链表属性中，并且建立起父子关系（`QtObject` 除外，`Item` 及其 C++ 派生类有效，在 QML 中重新设定默认属性的无效）。

## QML 中 qmltype 类型的默认属性

> qmltype 为包括 `var` 不定类型，但是不包括 `list<T>` 的 `QtObject` 或者 `Item` 及其派生类型。

如下定义了一个新的 qmltype，并且设定了默认属性的类型是 `Item`。

```
//~ MyItem.qml
Item {
    default property Item myChild
}
```

如下代码 `child` 和 `root` 构建起了父子关系。

```
//~ test1.qml
MyItem {
    id: root
    Item {
        id: child
    }
}
```

如下代码和上述代码方式类似：

```
//~ test2.qml
MyItem {
    id: root
    myChild: Item {
        id: child
    }
}
```

再看看如下代码：

```
//~ test3.qml
MyItem {
    id: root
    Item {
        id: child0
    }
    Item {
        id: child1
    }
}
```

出现了两个 `Item`，此时默认属性是捕获最后一个 `child1`。但是 `child0` 和 `child1` 都和 `root` 建立起了父子关系。

此外 QML 在构建时会进行类型检查，并允许类型的向上转换，如下代码编译不通过。

```
MyItem {
    id: root
    QtObject {
        id: child0
    }
}
```

因为 `QtObject` 不能转换为 `Item`。

## QML 中自定义默认映射链表属性映射到 native 默认链表属性

> **native 默认链表属性**，是指在 c++ 代码中，定义 qmltype 的类中，使用类似 ` Q_CLASSINFO("DefaultProperty", "data")` 声明的某个链表属性。例如 `Item::data`，在 c++ 代码中，**会对加入 `data` 的 `QObject*` 进行父子关系构建**。`Item::data` 的类型在 c++ 是 `QQmlListProperty<QObject>`，在 qml 中的类型是 `list<QtObject>`。

> **自定义默认映射链表属性**是指在 qml 文档中定义的默认属性以引用的方式映射到 **native 默认链表属性**。

先看如下代码：

```
//~ Container.qml
Item {
    id: container
    default property alias data: content.data
    Item {
        id: content
        anchors.fill: container
        anchors.margins: 10
    }
}

//~ userContainer.qml

Container {
    Rectangle { 
        id: rect
        anchors.fill: parent
    }
}
```

上诉代码定义了一个新的 qmltype `Container` ，并将**默认链表属性**映射为内部 `content` 的 `data`。在使用 `Container` 时，这个机制会将所有的 `Container` 实例化后的所有内部的对象（不包括原本 `Container` 内部的 `content`）与 `content` 建立起父子关系。

这种做法一般用来定制一些有布局关系的控件。例如带有头部、内容区域、底部的 `Page`  控件。如下提供一个简单的示例代码：

```
//~ Page.qml
Item {
    id: page
    default property alias data: content.data
    Item {
        id: header
        width: page.width
        height: 10
    }
    Item {
        id: footer
        width: page.width
        height: 10
    }
    Item {
        id: content
        width: page.width
        anchors.top: header.bottom
        anchors.bottom: footer.top
    }
}

//~ userPage.qml
Page {
    Button {}
}
```

使用时，就可以看到效果，`Button` 是位于 `Page` 的内容区域中，而不会在 `Page` 的头部或者尾部，意味着可以将**控件内部的子控件限定在指定的布局中**。

## QML 中自定义默认链表属性

> **自定义默认链表属性**是指形如 `default property list<T> defaultProperies` 的属性。

先看如下代码：

```
//~ MyItem.qml
Item {
    default property list<Item> myChildren
}

//~ userMyItem
MyItem {
    Item {}
    Item {}
    Item {}
    Item {}    // parent is null
}
```

但是这个 `MyItem` 不会与实例化后的内部对象实体建立起父子关系。怎么办？只能直接**手动设置父子关系**了。

```
//~ MyItem.qml
Item {
    id: myItem
    default property list<Item> myChildren
    onMyChildrenChanged: {
        for(var iter in myChildren) { 
            myChildren[iter].parent = myItem;
        }
    }
}

//~ userMyItem
MyItem {
    Item {}
    Item {}
    Item {}
    Item {}
}
```

这样就可以做到和 **native 默认链表属性**同样的功能了。

---

[QML Object Attributes](http://doc.qt.io/qt-5/qtqml-syntax-objectattributes.html)
