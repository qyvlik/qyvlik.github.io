# QML与C++之间的参数类型转换

> 作者 [qyvlik](http://blog.qyvlik.space)

严格来说 QML 是 JavaScript 的一个拓展，应该属于弱类型语言，但是 QML 其实是强类型的语言，辅以 JavaScript 的弱类型（挺像泛型的），这样即确保运行速度，又能确保灵活性。

## QML 与 C++ 类型映射

| Qt Type | QML Basic Type |
|:--:|:--:|
| bool | bool |
| unsigned int, int | int |
| double | double |
| float, qreal | real |
| QString | string |
| QUrl | url |
| QColor | color |  
| QFont | font |
| QDate | date |
| QPoint, QPointF |point  |
| QSize, QSizeF | size |
| QRect, QRectF | rect |
| QMatrix4x4 | matrix4x4 |
| QQuaternion | quaternion |
| QVector2D, QVector3D, QVector4D | vector2d, vector3d, vector4d |
| vector2d, vector3d, vector4d | enumeration |
| QVariant，QVariantMap，QVariantList,QJSValue | var,jsObject,jsArray,variant |
| QJsonValue,QJsonObject, QJsonArray | var, JSONObject |
| QObject* | id |

根据 [Data Type Conversion Between QML and C++](http://doc.qt.io/qt-5/qtqml-cppintegration-data.html)。

经测试，`QVariant`，`QVariantMap`，`QVariantList` 可以处理var类型的属性。

另外可以将 qml 对象的 id 传入，C++参数是 `QObject*`。

如果要将一个数组从 `C++` 传给 `QML`，最好使用 `QJsonArray`，或者 `QList<QString>`，`QList<QVariant>`，`QList<QJSValue>`。 

> **注意**：不同 `QJSEngine` 之间的 `QJSValue` 不同互相使用。

---

视频：[C++ 与 QML 的交♂互♀](https://www.bilibili.com/video/av4085094/)
