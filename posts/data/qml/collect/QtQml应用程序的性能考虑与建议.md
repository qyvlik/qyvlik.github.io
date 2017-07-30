# QtQml 应用程序的性能考虑与建议

> 原文：csdn aidear_evo [QtQml应用程序的性能考虑与建议](http://blog.csdn.net/ieearth/article/details/44754573)

> 本文翻译自Qt官网文档：http://doc.qt.io/qt-5/qtquick-performance.html

## 时间考虑

作为一名程序开发者，应该努力使渲染引擎的刷新率维持在60fps，也就是说在每帧之间大约有16ms，这段时间包括了基本图元在图形硬件上的描画。具体内容如下：

1. 尽可能的使用异步事件驱动来编程。

2. 使用工作者线程来处理重要的事情，比如说QML的WorkerScript类型就是起用了一个新的线程。

3. 不要手动重复事件循环。

4. 每帧的函数阻塞的时间不要超过几毫秒。

如果不注意上面提到的内容，就会导致跳帧，影响用户体验。

> **注意**：QML 与 C++ 交互时，为了避免阻塞就去创建自己的 `QEventLoop` 或调用`QCoreApplication::processEvents()`，这虽说是一种常见的模式，但也是危险的，因为信号处理或绑定进入事件循环时，QML 引擎会继续运行其它的绑定、动画、状态迁移等，这些动作就可能带来副作用，例如，破坏包含了事件循环的层级结构。

## 性能分析

最重要的建议：使用 QtCreator 软件提供的 **QML 性能分析工具**，以查看应用程序的时间花销，这样就可以把着重点放在实际存在的问题上，而不是那些潜在的问题，QtCreator 文档提供了 **QML 性能分析工具**的用法，可参考如下网址：[Profiling QML Applications](http://doc.qt.io/qtcreator/creator-qml-performance-monitor.html)

通过 **QML 性能分析工具**，查看高频度的绑定、时间花销较大的函数，以优化焦点问题、重写实现细节，相反不使用 **QML 性能分析工具**的话，就没有显著的性能提升效果。

## JavaScript代码

QML 是对 JavaScript 的扩展，所以在 QML 应用程序中经常有大量的 JavaScript 代码，例如函数与信号的动态参数类型或属性绑定表达式，这些通常都不是问题所在，反而由于 QML 引擎的优化，使得绑定比 C++ 函数调用效率更高，但也要注意不必要事件的偶发性。

### 绑定

绑定在 QML 中有两种类型：优化的和非优化的。绑定表达式越简单越好，QML 引擎发挥了优化的绑定表达式的求值特性，使得简单的绑定表达式不用转换到纯 JavaScript 运行环境就可以求值。优化的绑定在求值时比复杂的非优化的绑定效率更高，前提是所有用到的类型信息在编译时刻都应该是知道的。最大化地优化绑定表达式应该避免以下事情：

1. 声明JavaScript中间变量。

2. 访问“var”类型的变量。

3. 调用JavaScript函数。

4. 用绑定表达式构建闭包或定义函数。

5. 在即时求值范围外访问属性。

6. 与其它属性绑定引起的副作用。

在运行 QML 应用程序时，可能要设置 `QML_COMPILER_STATS` 环境变量以打印与绑定相关的数据，当知道对象和属性的类型时，绑定速度是最快的，也就是说在绑定表达式查值过程中某些非最终状态的属性的类型可能会有变化，这样绑定速度就变慢了。即时求值范围包括以下内容：

1. 绑定表达式所在对象的属性。

2. 组件中的 id。

3. 组件中的根元素 id。

其它组件的对象 id、属性，还有通过 import 导入的东西，是不在即时求值范围的，在这种情况下，绑定是不被优化的。需要注意的是，如果绑定没有被 QML 引擎优化，就会在纯 JavaScript 环境中求值，这时上面的几点建议就不再适用了。有时候在非常复杂的绑定中，缓存 JavaScript 中间变量的属性求值结果是有益的，这个在后面的内容中会有描述。

### 类型转换

当访问 QML 类型的属性时，对应的 JavaScript 对象就会被创建，这个对象带有外部资源，包括基本的 C++ 数据，这是使用 JavaScript 的一个主要花销，在大多数情况下这个花销很小，但有时这个花销就很大，例如用 C++ 的 `QvariantMap` 类型的数据(用到了 `Q_PROPERTY` )赋值给 QML 的 `variant` 类型的属性，尽管 `int`、`qreal`、`bool`、`QString`、`QUrl` 参数化的 `QList` 列表花销不大，但其它类型的列表花销就很大了，这个涉及到 JavaScript 数组的创建、类型添加及转换。在基本类型间转换的花销也可能不小，比如说 string 和 url 类型间的转换，应该使用匹配最接近的类型，避免不必要的类型转换。

如果必须暴露 `QVariantMap` 类型给 QML 时，QML 的属性类型应该是 `var` 而不是 `variant`，通常情况下，也应该优先考虑 `var` 类型，这样就可以存储真正的 JavaScript 引用，而且 `variant` 类型在`QtQuick2.0` 及以后的版本中已标记为废弃使用。

### 属性解析

属性解析要花一点时间，在某些情况下，多次访问同一属性时，其结果被存储起来的话，就可避免重复性的不必要的工作。如下例子，有个要经常用到的代码块，在 for 循环中多次访问了 `rect` 对象的 `color` 属性，其实就是一个共同的属性绑定表达式。

```
// bad.qml
import QtQuick 2.3

Item {
    width: 400
    height: 200
    Rectangle {
        id: rect
        anchors.fill: parent
        color: "blue"
    }

    function printValue(which, value) {
        console.log(which + " = " + value);
    }

    Component.onCompleted: {
        var t0 = new Date();
        for (var i = 0; i < 1000; ++i) {
            printValue("red", rect.color.r);
            printValue("green", rect.color.g);
            printValue("blue", rect.color.b);
            printValue("alpha", rect.color.a);
        }
        var t1 = new Date();
        console.log("Took: " + (t1.valueOf() - t0.valueOf()) + " milliseconds for 1000 iterations");
    }
}
```

在 `for` 循环中保存相同的 `rect` 的 `color`：

```
// good.qml
import QtQuick 2.3

Item {
    width: 400
    height: 200
    Rectangle {
        id: rect
        anchors.fill: parent
        color: "blue"
    }

    function printValue(which, value) {
        console.log(which + " = " + value);
    }

    Component.onCompleted: {
        var t0 = new Date();
        for (var i = 0; i < 1000; ++i) {
            var rectColor = rect.color; // resolve the common base.
            printValue("red", rectColor.r);
            printValue("green", rectColor.g);
            printValue("blue", rectColor.b);
            printValue("alpha", rectColor.a);
        }
        var t1 = new Date();
        console.log("Took: " + (t1.valueOf() - t0.valueOf()) + " milliseconds for 1000 iterations");
    }
}
```

一个简单的改变就可以显著提高性能，上面的代码还可以做进一步的修改，因为 `rect` 对象的 `color` 属性在 `for` 循环中没有变，所以可以把这个存储过程移到 `for` 循环外：

```
// better.qml
import QtQuick 2.3

Item {
    width: 400
    height: 200
    Rectangle {
        id: rect
        anchors.fill: parent
        color: "blue"
    }

    function printValue(which, value) {
        console.log(which + " = " + value);
    }

    Component.onCompleted: {
        var t0 = new Date();
        var rectColor = rect.color; // resolve the common base outside the tight loop.
        for (var i = 0; i < 1000; ++i) {
            printValue("red", rectColor.r);
            printValue("green", rectColor.g);
            printValue("blue", rectColor.b);
            printValue("alpha", rectColor.a);
        }
        var t1 = new Date();
        console.log("Took: " + (t1.valueOf() - t0.valueOf()) + " milliseconds for 1000 iterations");
    }
}
```

### 属性绑定

因为属性绑定表达式中的某一个属性改变时，这个表达式就会重新求值，所以绑定表达式要力求简单。在循环中使用了绑定表达式时，绑定属性的最后结果才是重要的，这时就可以使用一个临时累加变量，而不是直接在绑定属性上累加，以免额外的重复求值过程，下面的例子说明了这一点：

```
// bad.qml
import QtQuick 2.3

Item {
    id: root
    width: 200
    height: 200
    property int accumulatedValue: 0

    Text {
        anchors.fill: parent
        text: root.accumulatedValue.toString()
        onTextChanged: console.log("text binding re-evaluated")
    }

    Component.onCompleted: {
        var someData = [ 1, 2, 3, 4, 5, 20 ];
        for (var i = 0; i < someData.length; ++i) {
            accumulatedValue = accumulatedValue + someData[i];
        }
    }
}
```

在上面的 `for` 循环中，`accumulatedValue `改了六次，导致与其绑定的 `text` 属性也改了六次，
`onTextChanged` 信号处理器也响应了六次，这些都是不必要的，`accumulatedValue`的最终结果才是最重要的，使用中间变量 `temp` 修改如下：

```
// good.qml
import QtQuick 2.3

Item {
    id: root
    width: 200
    height: 200
    property int accumulatedValue: 0

    Text {
        anchors.fill: parent
        text: root.accumulatedValue.toString()
        onTextChanged: console.log("text binding re-evaluated")
    }

    Component.onCompleted: {
        var someData = [ 1, 2, 3, 4, 5, 20 ];
        var temp = accumulatedValue;
        for (var i = 0; i < someData.length; ++i) {
            temp = temp + someData[i];
        }
        accumulatedValue = temp;
    }
}
```

### 列表属性

前面提到了，`QList<int>`、`QList<qreal>`、`QList<bool>`、`QList<QString>`、`QStringList`、
`QList<QUrl>`等类型在 C++ 和 QML 间的转换是快速的，其它的列表类型则是很慢的。即使是使用这些转换快速的列表类型，也要格外注意，以获得最佳性能。

首先，列表类型的实现有两个方法，一个是 `QObject` 对象的 `Q_PROPERTY` 宏，称作列表引用，另一个是来自 `QObject` 对象的 `Q_INVOKABLE` 宏标记的函数的返回值，称作列表拷贝。列表引用的读写是通过 `QMetaObject::property()` 进行的，属性类型通过 `QVariant` 来处理。

通过 JavaScript 改变列表属性值时要经过三个步骤：读取列表、改变列表中特定下标的元素、写入列表。

列表拷贝相对来说就简单多了，因为 JavaScript 对象的资源数据存储了实际的列表，直接修改资源数据即可，不用经过列表引用的读、改、写这个过程。所以，列表拷贝比列表引用速度更快，事实上对单一的元素列表而言，两者速度是差不多的。通常情况下，要修改临时列表拷贝，然后把这个结果赋值给列表引用。假设定义了下面例子中的 C++ 类且注册到了 Qt.example 包中，版本是1.0：

```
class SequenceTypeExample : public QQuickItem
{
    Q_OBJECT
    Q_PROPERTY (QList<qreal> qrealListProperty READ qrealListProperty WRITE setQrealListProperty NOTIFY qrealListPropertyChanged)

public:
    SequenceTypeExample() : QQuickItem() { m_list << 1.1 << 2.2 << 3.3; }
    ~SequenceTypeExample() {}

    QList<qreal> qrealListProperty() const { return m_list; }
    void setQrealListProperty(const QList<qreal> &list) { m_list = list; emit qrealListPropertyChanged(); }

signals:
    void qrealListPropertyChanged();

private:
    QList<qreal> m_list;
};
```

下面的例子在for循环中给列表引用赋值，性能较差：

```
// bad.qml
import QtQuick 2.3
import Qt.example 1.0

SequenceTypeExample {
    id: root
    width: 200
    height: 200

    Component.onCompleted: {
        var t0 = new Date();
        qrealListProperty.length = 100;
        for (var i = 0; i < 500; ++i) {
            for (var j = 0; j < 100; ++j) {
                qrealListProperty[j] = j;
            }
        }
        var t1 = new Date();
        console.log("elapsed: " + (t1.valueOf() - t0.valueOf()) + " milliseconds");
    }
}
```

上面例子频繁读写 `QObject` 的 `qrealListProperty` 属性列表，性能欠佳，下面的更改效果会更好：

```
// good.qml
import QtQuick 2.3
import Qt.example 1.0

SequenceTypeExample {
    id: root
    width: 200
    height: 200

    Component.onCompleted: {
        var t0 = new Date();
        var someData = [1.1, 2.2, 3.3]
        someData.length = 100;
        for (var i = 0; i < 500; ++i) {
            for (var j = 0; j < 100; ++j) {
                someData[j] = j;
            }
            qrealListProperty = someData;
        }
        var t1 = new Date();
        console.log("elapsed: " + (t1.valueOf() - t0.valueOf()) + " milliseconds");
    }
}
```

其次，**列表中任意一个元素改变时，都会发一个信号**，如果有许多绑定了列表中特定元素的属性，最好是创建一个与这个特定元素关联的动态属性，而不是直接绑定，这样也是为了避免不必要的重复求值过程，这种情况虽不寻常，但也值得多多注意，如下面的例子：

```
// bad.qml
import QtQuick 2.3
import Qt.example 1.0

SequenceTypeExample {
    id: root

    property int firstBinding: qrealListProperty[1] + 10;
    property int secondBinding: qrealListProperty[1] + 20;
    property int thirdBinding: qrealListProperty[1] + 30;

    Component.onCompleted: {
        var t0 = new Date();
        for (var i = 0; i < 1000; ++i) {
            qrealListProperty[2] = i;
        }
        var t1 = new Date();
        console.log("elapsed: " + (t1.valueOf() - t0.valueOf()) + " milliseconds");
    }
}
```

上面例子中，虽然改变的是列表中下标为2的元素，但绑定到了列表中下标为1的属性也会重新求值，所以引入一个中间变量效果更好：

```
// good.qml
import QtQuick 2.3
import Qt.example 1.0

SequenceTypeExample {
    id: root

    property int intermediateBinding: qrealListProperty[1]
    property int firstBinding: intermediateBinding + 10;
    property int secondBinding: intermediateBinding + 20;
    property int thirdBinding: intermediateBinding + 30;

    Component.onCompleted: {
        var t0 = new Date();
        for (var i = 0; i < 1000; ++i) {
            qrealListProperty[2] = i;
        }
        var t1 = new Date();
        console.log("elapsed: " + (t1.valueOf() - t0.valueOf()) + " milliseconds");
    }
}
```

通过上面的修改，只有中间变量会重新求值，性能得到了改善。

### 值类型

如 `font`、`color`、`vector3d` 等值类型，也有类似 `QObject` 的 C++ 类，对于上面提到的列表属性的优化问题也是适用的，也要避免不必要的重复求值过程，注意性能影响。

### 其它JavaScript对象

不同的 JavaScript 引擎提供了不同的优化措施，QtQuick2 使用的 JavaScript 引擎用来对象实例和属性查询的优化，但也有一定的前提条件，如果前提条件不满足，性能就会受到严重的影响，下面两个条件是必须要保证的：

1. 尽量避免使用 `eval()`。

2. 不要删除对象的属性。

## 通用的接口元素

### 文本元素

文本布局解析是一个较慢的操作，为了减少布局引擎的工作量，尽可能的使用 `PlainText` 而不是StyledText。如文本中要嵌入图片或标签，以及文本字体加粗或倾斜等，这时就要用到 `StyledText` 了，但还是有文本解析上的开销，用 `AutoText` 即可。另外，不建议使用 `RichText`，因为 `StyledText` 已提供了几乎所有的文本特性。

### 图片

图片在 UI 的地位是举足轻重的，但由于其加载时间的开销、内存消耗及不同的使用方式，也是许多问题的主要来源。

1. 异步加载。

    图片资源一般是很大的，加载时要避免阻塞 UI 线程，异步加载是个很好的选择，它的加载过程会在一个低优先级的工作线程执行。使用 QML 的 `Image` 元素加载本地图片时，把它的 `asynchronous` 属性设置为 `true` 就是异步加载，如果加载的是远程非本地的图片，加载方式默认就是异步的。

2. 显式指定图片尺寸。

    图片的 `sourceSize` 属性改变时，图片会重新加载。如果在一个小的元素中加载一张大的图片，应该设置 `sourceSize` 属性与小元素的尺寸一致，保证图片是以小尺寸而非本身大尺寸的形式缓存的。

3. 运行时避免图片合成。

    避免在运行时是提供预先合成的图片资源，比如说提供带有阴影效果的元素。

### anchors 锚布局

在元素布局时，使用 `anchors` 锚布局比属性绑定效率更高。下面例子 `rect2` 对象绑定到了 `rect1` 对象上：

```  
Rectangle {
    id: rect1
    x: 20
    width: 200; height: 200
}
Rectangle {
    id: rect2
    x: rect1.x
    y: rect1.y + rect1.height
    width: rect1.width - 20
    height: 200
}
```

如下例子使用 anchors 锚布局效果更好：

```
Rectangle {
    id: rect1
    x: 20
    width: 200; height: 200
}
Rectangle {
    id: rect2
    height: 200
    anchors.left: rect1.left
    anchors.top: rect1.bottom
    anchors.right: rect1.right
    anchors.rightMargin: 20
}
```

位置绑定虽说灵活，但相对 `anchors` 锚布局来说效率还是不高的。如果布局非动态的话，使用静态初始化是最好的方式，坐标是相对于父元素的，子元素相对于父元素的偏移量想要是固定值的话，就不应该使用 `anchors` 锚布局。下面的例子中有两个子 `Rectangle`，位置和大小一样，但布局方式不同，`anchors` 锚布局这时就没有静态初始化效率高了。

```
Rectangle {
    width: 60
    height: 60
    Rectangle {
        id: fixedPositioning
        x: 20
        y: 20
        width: 20
        height: 20
    }
    Rectangle {
        id: anchorPositioning
        anchors.fill: parent
        anchors.margins: 20
    }
}
```

## 模型与视图

许多应用程序都至少有一个给视图提供数据的模型，在性能最优化方面，这也是一个需要注意的地方。

### 自定义的 C++ 模型

在C++中自定义模型供 QML 中的视图使用，最优实现在很大程度上依赖具体的用例，使用指南如下：

1. 尽可能的使用异步。

2. 在低优先级的工作者线程中做所有的处理。

3. 分批执行后端操作以降低 I/O 和 IPC。

4. 使用滑动窗口缓存结果。

使用低优先级的工作者线程是很重要的，这样可以减小 GUI 线程“挨饿”的风险，以免导致糟糕的性能，另外，同步与上锁机制也会影响性能，也是推荐避免使用的。

### ListModel 这个 QML 类型

QML提供的 `ListModel` 类型给 `ListView` 提供数据，只要运用正确的话，大多数用例也会有相对较佳的性能。

#### 使用工作者线程填充

`ListModel` 元素在 `QtQuick2` 中的性能要好于 `QtQuick1`，这主要是基于给定模型中每个角色的类型，类型不变时，缓存性能的提升是非常明显的，类型动态变化时，性能提升就会受到影响，因此 `dynamicRoles` 默认是不可用的，手动设置为 `true` 时就要承担随之而来的性能退化了，如果可能的话重新设计应用程序而不要使用动态类型。

### 视图

视图代理越简单越好，使用 QML 展示必要的信息，任何额外的功能都不是即时的，在真正用到它时才会体现出来，设计视图代理时要注意以下内容：

1. 代理中的元素越少，代理的创建越快，视图的滚动越快。

2. 代理中的绑定尽可能少，位置布局时用anchors替代绑定或相对位置。

3. 代理中的元素避免使用 `ShaderEffect`。

4. 代理中不要使用 `clip` 剪切效果。

设置 `cacheBuffer` 属性，允许异步创建和可视化区域外的缓存，对于那些重要的不可能在单帧下创建的代理，`cacheBuffer` 便是推荐设置的。`cacheBuffer` 会使用一部分内存，这是开发者要权衡的事情，避免视图滚动时帧刷新率的降低。

## 可视化特效

`QtQuick2` 提供了一些特性，供开发设计者创建例外地诱人的 UI，如流畅的动态变换和一些可视化的特性，在 QML 中使用这些特性的同时，也要注意性能方面的影响。

### 动画

通常说来，一个属性播放动画时会引起与之绑定的表达式重新求值，这是想要的结果，但有些情况下，期望绑定优先于属性动画，所以在属性动画结束后重新设置这个绑定。在动画中要避免使用 JavaScript，如 `x` 属性动画的每帧要避免复杂的 JavaScript 表达式。开发者也要注意脚本动画的使用，因为脚本动画是在主线程执行的，时间过长的话有可能导致跳帧。

### 粒子

`QtQuick.Particles` 模块使得漂亮的粒子效果可以 UI 中得以实现，然而每个平台的图形硬件性能都不同，粒子当然也就不能无限的设置其参数了，以免超出硬件支持的范围。试图描画的粒子越多，所需的图形硬件以 60 FPS 来描画就要求越高，渲染更多的粒子也要求更快的 CPU，因此在目标平台上测试粒子效果是非常重要的，校正以60FPS渲染粒子的数量和尺寸。用不到粒子系统时不要使用粒子，如不可视元素，减少不必要的仿真。关于粒子系统的性能指南可参考如下Qt官方网址：[Particle System Performance Guide](http://doc.qt.io/qt-5/qtquick-particles-performance.html)

## 元素生命周期的控制

把一个应用程序拆分成简单的、模块化的组件，每个组件包含有一个单一的 QML 文件，这样就可以获得快速的启动时，拥有更好的内存管理，减少程序中已激活却不可见的元素

### 实例化延迟

QML 引擎做了一些微妙的事情来保证组件加载和实例化不引起跳帧，然而除了避免做不必要的工作和工作延迟外，却没有更好的办法来减少启动时，QML 的 `Loader` 便可以动态的创建组件。

#### 使用Loader

Loader是QML中的一个元素，可以动态的加载和卸载一个组件：

1. 使用 `active` 属性，可以延迟实例化。

2. 使用 `setSource()` 函数，提供初始属性值。

3. `asynchronouse` 为 `ture` 时，在组件实例化时可提高流畅性。

#### 使用动态创建

开发者可使用 `Qt.createComponnet()` 在运行时动态的创建组件，然后调用 `createObject()` 来完成实例化，还需要的就是在适当的时候手动删除创建的对象，具体可参考如下网址：[Dynamic QML Object Creation from JavaScript](http://doc.qt.io/qt-5/qtqml-javascript-dynamicobjectcreation.html)。

### 销毁不用的元素

有些不可见元素，如 `Tab` 插件的第一个插件显示时后面的就不可见，因为它们是不可见元素的孩子，所以在大多数情况下要延迟实例化，而且在不用的时候还要销毁，以避免不必要的开销，如渲染、动画、绑定等。使用 `Loader` 加载元素时，可以重置 `source` 或 `sourceComponnet` 属性为空来释放这个元素，其它的元素可调用 `destroy()` 来销毁。在某些情况下，这些元素还是要保留激活状态，但在最后要设置为不可见。下面的渲染部分也会谈到这一点。

## 渲染

在 `QtQuick2` 中，用作渲染的场景图可在 60 FPS 下高度动态的渲染 UI，但有些东西会极大的降低渲染性能，这些缺点便是开发者需要注意的地方。

### 剪切

剪切默认是不可用的，在需要的时候再去设置它。剪切效果是可视的，它并不是一项优化措施，而是根据边界剪切掉自己和孩子的多余部分，打破了自由的渲染各个元素的顺序，使最优变成了次优，特别是在**视图代表中要不惜一切代价避免使用剪切功能**。

#### 可视元素与覆盖

如果某些元素被其它不透明的元素完全覆盖时，最好的办法是设置这些元素的 `visible` 属性为 `false`，让它们不可见，否则它们的描画就是多余的。同样，在不可见元素需要在启动时初始化的情况下，也要设置其 `visible` 属性为 `false`。

### 透明与不透明

不透明的内容通常比透明的内容描画起来要快点，这是因为透明还需混调，不透明在优化方面反而更好。一张图片即使是不透明的，但在某个像素透明时是被当作全透明来处理的，这个对有透明边框的`BorderImage` 也是适用的。

### 着色

QML 的 `ShaderEffect` 类型可以在 `QtQuick` 应用程序中嵌入 `GLSL` 代码，重要的是，着色范围内的每一个像素都要执行片源着色程序，如果在低端硬件上着色大量的像素时就会导致性能变差。用 `GLSL` 写的着色程序支持复杂的变换和可视化的特性，使用 `ShaderEffectSource` 可以在场景描画之前预先着色到 `FBO` 中，`FBO` 即帧缓存对象。

## 内存分配与回收

在应用程序中内存分配的总量及分配方式是非常重要的，抛去设备的内存限制不说，在堆上分配内存也是一笔昂贵的花销，这导致了整页数据的碎片化，JavaScript 对内存的处理则是自动回收，这是它的好处。一个 QML 应用程序的内存要用到 C++ 的堆和 JavaScript 的自动内存管理，在性能优化上，这两者的微妙之处需要格外注意。

### 对于QML应用程序开发者的建议

这些建议只是一个简单的指南，不一定在所有的场合下都适用，但为了做最好的决定，一定要通过一个富有经验的基准来分析

#### 延时实例化

如果在一个应用程序中有多个视图，但在某一时刻只会用到其中一个，那么其它的视图就可以使用延时实例化来降低内存消耗。

#### 销毁不用的对象

如果延时实例化了一个组件，或者用 JavaScript 表达式动态的创建了一个对象，较好的做法是调用 `destroy()` 来销毁，而不是等待垃圾自动回收机制来处理它。

#### 不要手动触发垃圾回收器

在大多数情况下，手动触发垃圾回收器是不明智的，不仅没必要反而还有副作用，因为这会阻塞 GUI 线程一段时间，导致跳帧和动画的不连贯，这个需要极力避免。

#### 避免复杂绑定

复杂的绑定会降低性能，同时还会占用更多的内存。

#### 避免定义多个隐式而又相同的类型

如果在 QML 中自定义了一个元素的属性，该属性就成了这个元素的隐式类型，这方面的内容会在下面作详细介绍。如果定义了多个隐式而又相同的类型，有些内存就浪费了，较好的做法是显式地定义一个新的组件来做同样的事情，这个组件还可复用。自定义属性可以优化性能，比如说减少了绑定和表达式重新求值的次数，而且还提高了组件的模块化特性和可维护性，然而这个属性多次使用时，就要放到自己的组件中。

#### 复用存在的组件

如果正在考虑定义一个新的组件时，一定要仔细确认这个组件是不存在的，否则就应该从另一个存在的对象中作个拷贝。

#### 使用单例代替 pragma 库

如果使用 pragma 库存储应用程序的实例数据时，考虑使用 QObject 单例是个更好的选择，因为后者性能更好，也会使用更少的 JavaScript 堆。

### 在 QML 应用程序中的内存分配

在 QML 应用程序中的内存用法可以分为两个部分：C++ 和 JavaScript。这两者中的有些内存分配是不可避免的，可能由 QML 引擎或 JavaScript 引擎分配，然后其它的内存分配主要取决于开发者。

C++堆包括：

1. 固定的不可避免的 QML 引擎分配的内存。

2. 每一个组件编译时的数据和类型信息。

3. 每一个 C++ 对象的数据，以及每一个元对象的元素。

4. QML 的 import 中的数据。

Javascript堆包括：

1. 强固定的不可避免的 `JavaScript` 引擎分配的内存。

2. 固定的不可避免的 `JavaScript` 集成。

3. 在 `JavaSciprt` 引擎运行时的类型信息。

4. `JavaScript` 的对象数据，如 `var` 类型、函数、信号等。

5. 表达式求值分配的变量。

进一步来说，JavaScript 堆分配有一种情况是在主线程的，还有一种可选的情况是在 `WorkerScript`  线程的。如果在应用程序中没有使用 `WorkerScript` 元素的话，也就没有上面提到的工作者线程。JavaScript 堆分配可能是几百万字节的，对于内存受限的设备来说，虽然 `WorkerScript` 元素有助于异步模型填充，但也要避免使用 `WorkerScript`。

QML 引擎和 JavaScript 引擎都会自动地产生缓存数据，每一个应用程序加载的组件是一个不同的、明确的类型，在 QML 中每一个元素自定义的属性是隐式类型，任何没有自定义属性的元素都被 JavaScript 和 QML 引擎当作是组件定义的显式类型，而不是它们自己的隐式类型，看下面的例子：

```
import QtQuick 2.3

Item {
    id: root

    Rectangle {
        id: r0
        color: "red"
    }

    Rectangle {
        id: r1
        color: "blue"
        width: 50
    }

    Rectangle {
        id: r2
        property int customProperty: 5
    }

    Rectangle {
        id: r3
        property string customProperty: "hello"
    }

    Rectangle {
        id: r4
        property string customProperty: "hello"
    }
}
```

在上面的例子中，r0 和 r1 对象都没有自定义属性，JavaScript 和 QML 引擎认为它们是同一个类型，即显式的 Rectangle 类型。r2、r3 和 r4 都有一个自定义属性，它们就被隐式地认为是不同的类型，r3 和 r4 虽有相同的自定义属性，但也是不同的类型。如果 r3 和 r4 是 RectangleWithString 组件的实例，这个组件定义了 `customProperty` 字符串属性，那么 r3 和 r4 就被认为是同一个类型。

### 深度考虑内存分配

无论何时决定考虑内存分配和性能权衡性能时，注意 CPU 缓存、操作系统分页和 JavaScript 引擎垃圾回收都是重要的，对比分析一些潜在的方法后选一个最佳方案。下面的计算机科学原则是应用程序开发者在实现细节中的实践经验结合起来的，对于这些原则的理解是非常重要的，另外，权衡性能时的对比分析是不能由理论计算代替的。

#### 碎片

碎片是 C++ 开发的一个问题，如果应用程序开发者没有定义任何 C++ 类型或插件的话，这倒是安全的，可以忽略这部分内容。久而久之，应用程序将分派很大一部分内存并写入数据，随后某些内存结束了数据使用后又会被释放掉，但是这些释放的内存不是在一个连续块里，是不能被操作系统的其它应用程序再次使用的，而且在缓存和特性访问上也有影响，因为这些数据可能占据了物理内存的不同分页，反过来又影响了操作系统的性能。碎片是可以避免的，使用池分配器或其它连续的内存分配器，减少内存总量，在任何时候分配内存时，小心的管理对象生命周期，周期性地清洁、重建缓存，或者使用类似 JavaScript 的运行时内存管理进行垃圾回收。

#### 垃圾回收

JavaScript 提供了垃圾回收器，内存在 JavaScript 引擎管理的 JavaScript 堆上分配，JavaScript 引擎周期性地在 JavaScript 堆上收集所有的未引用的数据，如果有了碎片的话，就会压缩这个堆，把现有的全部数据移到连续的内存区域，这样释放掉的内存就又可以被操作系统的其它应用程序使用了。

##### 垃圾回收的意义

垃圾回收是把双刃剑，好处是解决了碎片问题，也就是说手动管理对象的生命周期不再那么重要了，但是不足之处在于它的潜在的长时间持续的操作，这个可能由 JavaScript 引擎在某个时刻就开始了，却在应用程序开发者的控制之外。如果 JavaScript 堆运用不当的话，垃圾回收的频率和持续时间对程序会有负面影响。

##### 手动触发垃圾回收器

QML 应用程序在某些阶段需要垃圾回收，当可用内存不足时，JavaScript 引擎就会自动触发垃圾回收，有时候程序开发者决定何时触发垃圾回收器也是可行的。程序开发者很可能已经理解了程序在何时将会有一段很长的空闲时间，在 QML 程序中使用了很多的 JavaScript 堆内存，在特定的性能易受影响的任务中会引起周期性的垃圾回收，所以开发者可以在不考虑用户体验受到影响时手动触发垃圾回收，要调用 `gc()` 函数，这将带来深层次的垃圾回收及压缩周期，可能是几百毫秒，也可能超过几千毫秒，如果可能的话，还是不要手动触发垃圾回收器。

#### 内存与性能

在某些情况下，需要牺牲内存的消耗以换取性能的提升，如前面例子中提到的增加 JavaScript 临时变量以缓存查询结果的情形。有时候，增加内存消耗带来的影响也是很严重的，这时候就要权衡内存与性能的影响了。
