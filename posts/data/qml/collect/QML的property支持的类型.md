# QML的property支持的类型

> 作者 [qyvlik](http://blog.qyvlik.space)

本文的 `QML` 运行环境为 qt4，在 qt5 中同样支持。

在 Qt SDK 提供的文档中提及 property 支持类型。

`QML` 中的 `property` 的作用为对象声明属性，并且添加的属性可以进行跟踪（值被修改了就会发出信号）

添加的属性，官方文档只提及了添加基础类型属性的说明。诸如:`int`, `double`,  `bool`, `string`, `variant`, `color`, `real`, `vector3d`, `url`, `time`, `rect`, `size`, `enumeration`,  `font`, `date`, `point`, `list`, `action` 等基础到不能再基础的数据类型。

## 为 QtObject 添加 qml type 对象

这里提一个 qml 的元素: `QtObject`。

这个 `QtObject` 元素是直接继承自 `c++` 类: `QObject`，相对于 `Item` 占用的内存就小点。一般用来封装一些特定的功能函数。

但这个 `QtObject` 元素不能直接内嵌 `QML` 的其他元素，甚至连自己都不能内嵌。

比如下面的代码会报错:

```
//~ test.qml
import QtQuick 1.1

QtObject{
    QtObject{

    }
}
```

```
Cannot assign to non-existent default property 
         QtObject{ 
         ^ 
```

如果我想要在 `QtObject` 嵌套一个可用的 `QML` 元素，可以像下面这种写法

```
import QtQuick 1.1

QtObject{

    property list<QtObject>
    __listObject: [
        QtObject{
            id:a;
            property int _num: 100
        }
    ]

    property variant
    __varObject: QtObject{
        id:b;
        property int _num: 1000
    }

    property QtObject
    __object: QtObject{
        id:c;
        property int _num: 10000
    }

    Component.onCompleted: {
        console.debug("a:"+a._num);
        console.debug("b:"+b._num);
        console.debug("c:"+c._num);

        console.debug("__listObject:"+__listObject[0]._num);
        console.debug("__varObject:"+__varObject._num);
        console.debug("__object:"+__object._num);

    }
}
```

> **注意**：Qt 5 不推荐在 `QML` 中使用 `variant`，而是使用 `var` 进行代替。

输出结果是:

```
Qml debugging is enabled. Only use this in a safe environment!
a:100
b:1000
c:10000
__listObject:100
__varObject:1000
__object:10000
QDeclarativeView only supports loading of root objects that derive from QGraphicsObject 
```

`<QDeclarativeView only supports loading of root objects that derive from QGraphicsObject >` 这句就忽略不看。

如果想要在 `QtObject` 中内嵌一个或者多个 qml 元素作为属性，有如下三种写法：

第一种比较常用：

```
property variant object： QtObject { 
     // some property
     // some function
}
```

直接使用 `variant` 对应的是 js 中 `var`，很好用的一个东西。

第二使用一个list存储一个或多个qml元素实例：

```
    property list<QtObject> // QtObject 可以替换为任何已经注册的或者自定义的元素类型
    __listObject: [
        QtObject{
            id:a;
            property int _num: 100
        }
    ]
```

第三种就是我今天看一位大神的代码才猛然醒悟的：

```
    property QtObject
    __object: QtObject{
        id:c;
        property int _num: 10000
    }
```

> [yeatse/moebox](https://github.com/yeatse/moebox)

直接说明 `property` 是一个 `QtObject` 对象的实例。

第三种声明的属性其属性名指向的是一个实例化对象，并非是一个基本数据类型的值。所以对这样的属性进行赋值操作后，再打印其属性值是 `undefined`。

还有一个，以上三种声明的属性的写法和 `QML` 的标准属性名是不一样的，`QML` 的标准属性名写法是开头必须是小写字母开头。而以下划线开头的写法是告诉大家，这个属性是 **private**，不要随意变动他。

还有上诉的写法Qt 文档没有给出太多实例，只是在文档中说了一些(Qt4)

```
Any C++ data that is used from QML - whether as custom properties, or parameters for signals or functions -must be of a type that is recognizable by QML.
By default, QML recognizes the following data types:
bool
unsigned int, int
float, double, qreal
QString
QUrl
QColor
QDate, QTime, QDateTime
QPoint, QPointF
QSize, QSizeF
QRect, QRectF
QVariant
QVariantList, QVariantMap
QObject*

Enumerations declared with Q_ENUMS()

To allow a custom C++ type to be created or used in QML, the C++ class must be registered as a QML type using qmlRegisterType(), as shown in the Defining new QML elements section above.
```

最后这句话就说明了，只要通过 `QML` 的 注册函数 `qmlRegisterType()` 就能像第三种声明属性的方法那样将一个对象实例声明为属性。

## 神秘加成的默认属性

最后再提供一个好代码

```
//~ QObject.qml
QtObject {
    id: qObject

    /*!
        \qmlproperty QtObject QObject::data
        An object definition can have a single default property. A default property is
        the property to which a value is assigned if an object is declared within another
        object's definition without declaring it as a value for a particular property.
        \default
    */

    default property alias data: qObject.__data

    /*! \internal */
    property list<QtObject> __data
}
```

```
    QObject {
        id: qObject
        QObject{ }
        QtObject{ }
        Timer { }
        Settings{ }
    }
```

上诉代码来自 [QObject.qml](https://github.com/qyvlik/QObject.qml)

