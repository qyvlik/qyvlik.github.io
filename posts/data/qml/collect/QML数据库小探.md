# QML数据库小探

> 作者 [qyvlik](http://blog.qyvlik.space)

首先 `QML` 中的数据库文件是存放在某个路径中的，具体就是通过 `QmlEngine::offlineStoragePath` 属性得知。接着，在这个路径下，可能有多个数据库文件。

在 `QML` 中 `QtQuick.LocalStorage` 中的 `openDatabaseSync` 方法如下：

`object openDatabaseSync(string name, string version, string description, int estimated_size, jsobject callback(db))`

其中 `name`，`version`，`description`，`estimated_size` 这四个参数，根据这四个参数在 `QmlEngine::offlineStoragePath`  路径下所有的 `ini` 文件进行匹配（ini文件是对应数据库文件的配置文件，一般与对应数据库同名，保存了数据库的名字，版本号，描述和大小，数据库驱动类型，一般是 `QSQLITE`）。如果数据库文件不存在，就根据这四个文件进行数据库文件的构建。

好，现在有两个问题，一个是如何在 `C++` 中处理 `QML` 生成的数据库（都是 `sqlite` 数据库），其次如何在 `QML` 中打开指定的数据库文件。

首先说说如何在 `QML` 中打开指定的数据库文件。

在看看 `openDatabaseSync` 这个函数：

`object openDatabaseSync(string name, string version, string description, int estimated_size, jsobject callback(db))`

它是根据`QmlEngine::offlineStoragePath` 路径下的 `ini` 文件，进行数据库的打开或者创建操作。

所以，如果你现在有一个现成的数据库文件，可以尝试依葫芦画瓢，写一个对应的 `ini` 文件，再将数据库文件和 `ini` 文件放到应用的 `QmlEngine::offlineStoragePath` 路径下。

> 注意，`ini` 文件名要和数据库文件名相同，例如： `123.sqlite` 和 `123.ini`。

第二个是如何在 C++ 中打开在 QML 中的创建的数据库？或者说，C++ 如何通过数据库与 QML 进行数据交互。

## c++ 操作 qml 数据库

如果是一个 QtQuick 应用，而不是 QtQuick UI 项目，那么其 `QmlEngine::offlineStoragePath` 就会对应到每个应用的数据保存路径。

由于 `QML` 的数据库文件名是将数据库名的 `md5`，这里给出代码：

```
if (qmlEngine == Q_NULLPTR) {
    qDebug() << Q_FUNC_INFO << " return false, qmlEngine is null";
    return false;
}

QString offlineStoragePath = qmlEngine->offlineStoragePath();

QString databaseFile = offlineStoragePath + QDir::separator() +
        "Databases" + QDir::separator() + fileName + ".sqlite";         // fileName 为数据库名的 md5 值

qDebug() << Q_FUNC_INFO << " databaseFile: " << databaseFile;

static QSqlDatabase db = QSqlDatabase::addDatabase("QSQLITE");

db.setDatabaseName(databaseFile);
bool isOpen = db.open();

if (!isOpen) {
    qDebug() << Q_FUNC_INFO << " database can't open";
    return false;
}
```

---

[bool SQLiteUtils::vacuum4qml(const QString fileName) ](https://github.com/qyvlik/btc-address-watcher/blob/6212889ebe446d2369efe3226467bdb65adf70a7/src/sqliteutils.cpp#L20)
