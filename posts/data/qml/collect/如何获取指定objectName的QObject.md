# 如何获取指定objectName的QObject

> 作者 [qyvlik](http://blog.qyvlik.space)

如下`QML`代码，设置了一个 `objectName` 为 `YOUR_OBJECT_NAME` 的 `QML` 对象，现在需要在 `c++` 代码中获取到它。

```
//~ main.qml
import QtQuick 2.0
import QtQuick.Controls 2.0

ApplicationWindow {
    visible: true
    
    QtObject {
        objectName: "YOUR_OBJECT_NAME"
    }
}
```

如下 `c++` 代码，试图通过 `findChild` 函数来获取 `objectName` 为 `YOUR_OBJECT_NAME` 的 `QML` 对象，但是却返回空。

```
QQmlApplicationEngine engine;
engine.load("main.qml");

QList<QObject*> rootObjects = engine.rootObjects();

QObject* root = Q_NULLPTR;
foreach (QObject* iter, rootObjects) {
    if (iter->objectName() == "root") {
        root = iter;
        break;
    }
}

QObject* YOUR_OBJECT_NAME = root->findChild<QObject*>("YOUR_OBJECT_NAME", Qt::FindDirectChildrenOnly);
qDebug() << "YOUR_OBJECT_NAME:" << YOUR_OBJECT_NAME;
```

在仔细阅读代码，以及测试，发现，上述代码 `root->findChild` 只能获取到父类为 `Item` 的对象；父类为 `QtObject` 的对象，其父亲为 `Window::contentItem` 或者 `ApplicationWindow::contentItem`。这里给出通过 `objectName` 获取  `QML` 对象的代码：

```
QObject *findClindByObjectNameFromQmlEngine(QQmlApplicationEngine *qmlEngine, QString objectName)
{
    if (qmlEngine == Q_NULLPTR) {
        return Q_NULLPTR;
    }

    QList<QObject*> rootObjects = qmlEngine->rootObjects();
    QObject* child = Q_NULLPTR;

    foreach (QObject* iter, rootObjects) {
        if (iter->inherits("QQuickItem")) {
            child = iter->findChild<QObject*>(objectName);
            break;
        }

        child = iter->findChild<QObject*>(objectName);
        if (child != Q_NULLPTR) {
            break;
        }

        QObject* contentItem = iter->property("contentItem").value<QObject*>();
        if (contentItem != Q_NULLPTR) {
            child = contentItem->findChild<QObject*>(objectName);
            break;
        }
    }
    return child;
}
```
