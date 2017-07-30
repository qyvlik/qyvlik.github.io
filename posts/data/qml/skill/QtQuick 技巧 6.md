# QtQuick 技巧6

> 作者 [qyvlik](http://blog.qyvlik.space)

##  开启图像调试模式

参见 [`Qt Quick Scene Graph Renderer`](http://doc.qt.io/qt-5/qtquick-visualcanvas-scenegraph-renderer.html)

通过给环境变量 `QSG_VISUALIZE` 设置 `batches`，`clip`，`changes`，`overdraw` 即可进行图像调试.

如何给项目设置环境变量？

> 打开 QtCreator 最左侧的 `项目` 界面，**构建工具**切换到**运行**，找一找 `Run Environment` 或者 `运行环境`，直接添加 `QSG_VISUALIZE` 环境变量，并设置相应的值即可。此外设置的环境变量不会保存到系统环境变量，可以放行大胆的尝试。

## 开启 import 调试

设置 `QML_IMPORT_TRACE=1` 环境变量，即可查看 qml `import` 了那些库。

```
  QQmlImportDatabase::addImportPath "/qt-sdk/imports"
  QQmlImportDatabase::addImportPath "/qt-sdk/bin/QMLViewer.app/Contents/MacOS"
  QQmlImportDatabase::addToImport 0x106237370 "." -1.-1 File as ""
  QQmlImportDatabase::addToImport 0x106237370 "Qt" 4.7 Library as ""
  QQmlImportDatabase::resolveType "Rectangle" = "QDeclarativeRectangle"
```

[Debugging QML Applications](http://doc.qt.io/qt-5/qtquick-debugging.html)

## 一些 QML 代码

> version >= Qt. 5.5 

竖向布局，可滚动。

```
Item {
    id: root
    anchors.fill: parent
    anchors.margins: 10

    Flickable {
        anchors.fill: parent

        flickableDirection: ListView.VerticalFlick

        contentWidth: columnLayout.implicitWidth
        contentHeight: columnLayout.implicitHeight

        ColumnLayout {
            id: columnLayout
            width: root.width
        }
    }
}
```

## QML 中可使用的加密，Hash 库

[brix/crypto-js](https://github.com/brix/crypto-js)

> JavaScript library of crypto standards.

配置：

```
// crypto-js.js
Qt.include("./src/core.js");
Qt.include("./src/lib-typedarrays.js");
Qt.include("./src/x64-core.js");
Qt.include("./src/enc-utf16.js");
Qt.include("./src/enc-base64.js");
Qt.include("./src/md5.js");
Qt.include("./src/sha1.js");
Qt.include("./src/sha256.js");
Qt.include("./src/sha224.js");
Qt.include("./src/sha512.js");
Qt.include("./src/sha384.js");
Qt.include("./src/sha3.js");
Qt.include("./src/ripemd160.js");
Qt.include("./src/hmac.js");
Qt.include("./src/pbkdf2.js");
Qt.include("./src/evpkdf.js");
Qt.include("./src/cipher-core.js");
Qt.include("./src/mode-cfb.js");
Qt.include("./src/mode-ctr.js");
Qt.include("./src/mode-ofb.js");
Qt.include("./src/mode-ecb.js");
Qt.include("./src/pad-ansix923.js");
Qt.include("./src/pad-iso10126.js");
Qt.include("./src/pad-zeropadding.js");
Qt.include("./src/pad-iso97971.js");
Qt.include("./src/pad-nopadding.js");
Qt.include("./src/rc4.js");
Qt.include("./src/rabbit.js");
Qt.include("./src/rabbit-legacy.js");
Qt.include("./src/aes.js");
Qt.include("./src/tripledes.js");
```

使用：

```
import QtQuick 2.0

import "./crypto-js/crypto-js.js" as CryptoJSLib

Item {

    width: 360
    height: 640

    function testSHA256() {
        var encrypted = CryptoJSLib.CryptoJS.SHA256("");
        console.log("SHA256:", encrypted);
    }

    MouseArea {
        anchors.fill: parent
        onClicked: {
            testSHA256();
        }
    }
}
```

参考项目 [qml-snippet/code/crypto-qml](https://github.com/qyvlik/qml-snippet/tree/master/code/crypto-qml)
