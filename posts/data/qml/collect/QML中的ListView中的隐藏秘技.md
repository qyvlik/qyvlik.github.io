# QML中的ListView中的隐藏秘技

应该是 ListView 中 `delegate` 的秘技。

## ListView 代理中获取下标

```
ListView {
    model: 10
    delegate: Text {
        text: "index"+index
    }
}
```

使用 `index` 来获取代理在视图中展示的是哪个数据。（只此一条方法）

## ListView 代理中获取到一条模型记录的某个字段

```
ListView {
    width: 400
    height: 400
    model: ListModel {
        ListElement {
            age: 1
        }
        ListElement {
            age: 2
        }
        ListElement {
            age: 3
        }
        ListElement {
            age: 4
        }
    }
    delegate: Text {
        text: age
    }
}
```

如上所写，只要在 `delegate` 中写上对应的字段名（角色名）即可。

但是如果模型设置为 JavaScript 数组的时候，上诉写法就会报错了。如下：

```
ListView {
    width: 400
    height: 400
    model: [
        { "age":1},
        { "age":2},
        { "age":3},
        { "age":4},
    ]
    delegate: Text {
        text: age            // ReferenceError: age is not defined
    }
}
```

这个时候就需要获取一条模型记录，然后再取对应的字段（角色）了。

## ListView 代理中获取一条模型记录

如何在代理中获取 `model` 的一条记录呢？

这里先说说 `ListView::model` 所能接受的数据类型吧。

+ `int`

+ `QList<T>`

+ `QList<QObject*>`

+ `QListString`

+ `QAbstractItemModel`

+ `js array`

+ `ListModel`

大概有七种类型，如果将 `model` 设置为数字的话，就会进行简单的类型转换，转成成 `QList<int>` 这种序列类型，并从小到大的进行数据填充。

视图通过代理将模型中数据一个一个进行绘制。那么代理中怎么获取到一条模型记录呢？

且看如下代码：

```
ListView {
    anchors.fill: parent
    model: [
        {
            "age": 1
        },
        {
            "age": 2
        },
        {
            "age": 3
        },
        {
            "age": 4
        }
    ]
    delegate: Text {
        property var item: modelData
        property int age: item && item.age
        text: age
    }
}
```

`ListView` 在实例化代理中的图元时，会为每一个代理图元植入对应下标的 `modelData` ，这个就是一条模型记录，通过捕获 `modelData` 这个属性，然后在访问对应字段。

但是在 `ListView` 设置为 `ListModel` 的话，就无法使用 `modelDate`  这个属性了。然后直接给出兼容代码：

```
 // 本方法不适合在 QAbstractItemModel* 及其子类中使用，除非 QAbstractItemModel* 及其子类有设定 modelData 这个角色
property var item: try {
                       // modelData 适用与 list<QtObject> 类型， js 数组类型，数字等
                       // 注意 QtObject* 除 QAbstractItemModel* 外都会转换成 list<QtObject> 这种类型

                       // console.debug(typeof modelData)
                       return modelData;
                   } catch(e) {
                       return ListView.view.model.get(index);
                   }
```
 
上诉代码不能和 `QAbstractItemModel*` 这个模型配套。

这时需要对 `QAbstractItemModel*` 的子类做一些功夫。首先设置 `modelData` 这个角色，然后在 `QAbstractItemModel::data` 这个函数中返回对应到 `modelData` 的记录，这个记录可以使用一个结构体存放，或者使用 `QJasonObject` 存放。

具体代码如下：

`CppListModel` ：

```
#ifndef CPPLISTMODEL_H
#define CPPLISTMODEL_H

#include <QAbstractListModel>

class CppListModel : public QAbstractListModel
{
    Q_OBJECT
public:
    explicit CppListModel(QObject *parent = 0);

    enum Roles{
        NameRole = Qt::UserRole + 1,            // name
        AgeRole,                                // age
        ModelDataRole,                          // modelData
    };

    QHash<int, QByteArray> roleNames() const;
    int rowCount(const QModelIndex &parent) const;
    QVariant data(const QModelIndex &index, int role) const;
};

#endif // CPPLISTMODEL_H
```

实现：

```
#include "cpplistmodel.h"
#include <QJsonObject>
#include <QtDebug>

CppListModel::CppListModel(QObject *parent):
    QAbstractListModel(parent)
{  }

QHash<int, QByteArray> CppListModel::roleNames() const
{
    QHash<int, QByteArray> roleNames;
    roleNames.insert(NameRole, "name");
    roleNames.insert(AgeRole, "age");
    roleNames.insert(ModelDataRole, "modelData");
    return roleNames;
}

int CppListModel::rowCount(const QModelIndex &parent) const
{
    Q_UNUSED(parent);
    // 返回固定
    return 5;
}

QVariant CppListModel::data(const QModelIndex &index, int role) const
{
    if (!index.isValid() || index.row() < 0)
        return QVariant();

    if (index.row() >= 5) {
        qWarning() << "SatelliteModel: Index out of bound";
        return QVariant();
    }

    switch (role)
    {
    case NameRole:
        return QString("this name from cpp");
    case AgeRole:
        return 551;
    case ModelDataRole:
        return QJsonObject {
            { "name", "this name from cpp"},
            { "age", 551 }
        };
    default:
        break;
    }
    return QVariant();
}
```

在 QML 中使用：

```
import QtQuick 2.5
import QtQuick.Controls 1.4
import TestModel 1.0

ApplicationWindow {
    visible: true
    width: 360
    height: 640
    title: qsTr("Hello World")

    CppListModel {
        id: cppListModel
        // name, age
    }

    ListView {
        anchors.fill: parent
        model: cppListModel
        delegate: itemDelegate
    }

    Component {
        id: itemDelegate
        Item {

            // 本方法不适合在 QAbstractItemModel* 及其子类中使用，除非 QAbstractItemModel* 及其子类有设定 modelData 这个角色
            property var item: try {
                                   // modelData 适用与 list<QtObject> 类型， js 数组类型，数字等
                                   // 注意 QtObject* 除 QAbstractItemModel* 外都会转换成 list<QtObject> 这种类型

                                   console.debug("typeof modelData", typeof modelData)
                                   return modelData;
                               } catch(e) {
                                   return ListView.view.model.get(index);
                               }

            property string name    : item && item.age
            property string age     : item && item.age
            Text {
                anchors.centerIn: parent
                text: name + age
            }
        }
    }
}
```

---

[Using C++ Models with Qt Quick Views](http://doc.qt.io/qt-5/qtquick-modelviewsdata-cppmodels.html)
