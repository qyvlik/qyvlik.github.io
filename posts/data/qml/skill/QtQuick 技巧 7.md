# QtQuick 技巧 7

> 作者 [qyvlik](http://blog.qyvlik.space)

## 关闭qmlc

> Qt 5.8

```
qputenv( "QML_DISABLE_DISK_CACHE", "true" );
```

[can-qml-caching-in-qt-5-8-be-disabled-for-a-particular-project](https://stackoverflow.com/questions/41922581/can-qml-caching-in-qt-5-8-be-disabled-for-a-particular-project)

## 可滚动 Page

> Qt 5.8

```
//~ ScrollablePage.qml 
import QtQuick 2.6
import QtQuick.Controls 2.0

Page {
  id: page

  default property alias content: pane.contentItem

  Flickable {
      anchors.fill: parent
      contentHeight: pane.implicitHeight
      flickableDirection: Flickable.AutoFlickIfNeeded

      Pane {
          id: pane
          width: parent.width
      }

      ScrollIndicator.vertical: ScrollIndicator { }
  }
}
```

