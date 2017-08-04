# Q_GADGET 宏

> 作者 [qyvlik](http://blog.qyvlik.space)

> The Q_GADGET macro is a lighter version of the Q_OBJECT macro for classes that do not inherit from QObject but still want to use some of the reflection capabilities offered by QMetaObject. Just like the Q_OBJECT macro, it must appear in the private section of a class definition.

> Q_GADGETs can have Q_ENUM, Q_PROPERTY and Q_INVOKABLE, but they cannot have signals or slots

> Q_GADGET makes a class member, staticMetaObject, available. staticMetaObject is of type QMetaObject and provides access to the enums declared with Q_ENUMS.

大体就是，某些类，其父类不是 `QObject` 时，可以使用 `Q_GADGET` 代替 `Q_OBJECT` 宏，来实现枚举，属性和方法的脚本化，序列化，但是不支持信号与槽。

> Some value types in Qt such as QPoint are represented in JavaScript as objects that have the same properties and functions like in the C++ API. The same representation is possible with custom C++ value types. To enable a custom value type with the QML engine, the class declaration needs to be annotated with Q_GADGET. Properties that are intended to be visible in the JavaScript representation need to be declared with Q_PROPERTY. Similarly functions need to be marked with Q_INVOKABLE. This is the same with QObject based C++ APIs. For example, the Actor class below is annotated as gadget and has properties:

```
class Actor
{
    Q_GADGET
    Q_PROPERTY(QString name READ name WRITE setName)
public:
    QString name() const { return m_name; }
    void setName(const QString &name) { m_name = name; }
private:
 QString m_name;
}

 Q_DECLARE_METATYPE(Actor)
```

声明完，别忘记使用 `Q_DECLARE_METATYPE` 注册一下。

注意，这样的做法并不能直接在 QtCreator 中提供语法帮助。注册的基本带有方法的数值类型，可能是使用 `QJsValue` 或者 `QVariant` 进行封装，可以很好处理垃圾回收。
