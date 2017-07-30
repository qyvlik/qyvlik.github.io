# QML 与 C++ 交互之工厂方法

> 作者 [qyvlik](http://blog.qyvlik.space)

先看如下的类声明，声明了一个产品类和工厂类。

```
#include <QObject>

class Productor : public QObject
{
    Q_OBJECT
    Q_PROPERTY(int age READ age WRITE setAge NOTIFY ageChanged)
public:
    explicit Productor(QObject *parent = 0);

    int age() const;
    void setAge(int age);
signals:
    void ageChanged();

private:
    int m_age;
};


class QQmlEngine;
class QJSEngine;
class Factory : public QObject
{
    Q_OBJECT
public:
    Factory(QObject* parent);

    Q_INVOKABLE Productor* create();

    static QObject *singleton(QQmlEngine *engine, QJSEngine *scriptEngine);
};
```

c++ main 函数中注册方式如下：

```
    qmlRegisterType<Productor>("FactoryDemo", 1, 0, "Productor");

    qmlRegisterSingletonType<Factory>("FactoryDemo", 1, 0, "Factory", &Factory::singleton);
```

`Productor` 注册为类型，`Factory` 注册为单例。在 QML 中使用如下：

```
import QtQuick.Controls 1.2
import FactoryDemo 1.0

Button {
    text: qsTr("user create function")
    onClicked: {
        var p = Factory.create();
        console.log(p.age);
    }
}
```

## 语法补全和智能提示

由于 QtCreator 对 QML 函数的返回值类型支持不佳，所以无法对 `p` 进行代码的智能提示。

这个时候就可以使用属性与 `QOjbect*` 来 hack 一下了。

只需修改一行代码，且看如下：

```
class Factory : public QObject
{
    Q_OBJECT
    Q_PROPERTY(Productor* newCreate READ create )
    ...
};
```

只需添加一行属性声明的代码即可。

qml 使用如下，可以进行代码补全。

```
            var p2 = Factory.newCreate;
            console.log(p2.age);
```

![](images/QML 与 C++ 交互之工厂方法-001.png)
