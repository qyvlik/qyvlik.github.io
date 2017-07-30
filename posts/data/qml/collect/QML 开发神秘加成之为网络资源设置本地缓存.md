# QML 开发神秘加成之为网络资源设置本地缓存

直接上码：

```cpp
#include <QNetworkAccessManager>
#include <QNetworkDiskCache>
#include <QStandardPaths>
#include <QQmlNetworkAccessManagerFactory>

class MyNetworkAccessManagerFactory : public QQmlNetworkAccessManagerFactory
{
public:
    virtual QNetworkAccessManager *create(QObject *parent);
};

QNetworkAccessManager *MyNetworkAccessManagerFactory::create(QObject *parent)
{
    QNetworkAccessManager *nam = new QNetworkAccessManager(parent);
    QNetworkDiskCache* diskCache = new QNetworkDiskCache(nam);

    QString cachePath = QStandardPaths::displayName(QStandardPaths::CacheLocation);

    qDebug() << "cache path:" << cachePath;

    diskCache->setCacheDirectory(cachePath);
    diskCache->setMaximumCacheSize(100 * 1024 * 1024);   // 这里设置的缓存大小为 100 MB

    nam->setCache(diskCache);

    return nam;
}
```

然后使用如下：

```
    engine.setNetworkAccessManagerFactory(new MyNetworkAccessManagerFactory);
```

然后一些网络图片，在加载前就会访问本地是否有缓存，如果有，就直接拉取本地。注意 `XMLHttpRequest` 的内部实现是拥有另一个 `NetworkAccessManager`，所以这个工厂构建的 `NetworkAccessManager` 无法对 `XMLHttpReuqest` 产生作用。

此外，可以通过使用 `QDir` 以及 `QFile` 等文件操作来清空缓存。

此外提供一个可以统计文件夹大小的函数：

```
#include <QDir>

qint64 dirSize(const QString &path)
{
    QDir dir(path);
    qint64 size = 0;
    foreach (QFileInfo fileInfo, dir.entryInfoList(QDir::Files)) {
        size += fileInfo.size();
    }

    foreach (QString subDir, dir.entryList(QDir::Dirs | QDir::NoDotAndDotDot)) {
        size += dirSize(path + QDir::separator() + subDir);
    }
    return size;
}
```