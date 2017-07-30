# QtQuick 技巧 4

> 作者 [qyvlik](http://blog.qyvlik.space)

> 基于 QtQuick.Controls 1.x

## QML 窗体透明

```
ApplicationWindow {
    flags:  Qt.Window|Qt.FramelessWindowHint
    style: ApplicationWindowStyle {
        background: Item{ }
    }
}
```

```
ApplicationWindow {
    flags:  Qt.Window|Qt.FramelessWindowHint
    style: ApplicationWindowStyle {
        background: Rectangle{ color: "transparent" }
    }
}
```

## QML 不规则窗体

```
ApplicationWindow {
    flags:  Qt.Window|Qt.FramelessWindowHint
    style: ApplicationWindowStyle {
        background: Image{ source: "不规则.png" }
    }
}
```

## ListView 注意事项

`currentIndex` 必需在 `ListView::highlightRangeMode` 设置为 `ListView.StrictlyEnforceRange` 才能实时更新，不然可能永远都是 `0`。

## Text 注意事项

自动分行，需要指明 `Text::width`。不然分行没有参考值。

## QtQuick 母版页

```
//~ Panel.qml
Item {
    
    property alias headerHeight: headerLoader.height
    property alias footerHeight: footerLoader.height
    
    property Component headerComponent: null
    readonly property Item headerItem: headerLoader.item
    
    Loader {
        id: headerLoader
        width: parent.width
        height: 40
        sourceComponent: headerComponent
        Binding {
            target: headerLoader.item
            property: "anchors.fill"
            value: headerLoader
        }
    }
    
    property Component footerComponent: null
    readonly property Item footerItem: footerLoader.item
    
    Loader {
        id: footerLoader
        width: parent.width
        height: 40
        anchors.bottom: parent.bottom
        Binding {
            target: footerLoader.item
            property: "anchors.fill"
            value: footerLoader
        }
    }
    
    property Component contentComponent: null
    readonly property Item contentItem: contentLoader.item
    
    Loader {
        id: contentLoader
        width: parent.width
        anchors.top: headerLoader.bottom
        anchors.bottom: footerLoader.top;
        Binding {
            target: contentLoader.item
            property: "anchors.fill"
            value: contentLoader
        }
    }
}
```

使用：

```
Panel {
    headerComponent: Rectangle {
        color: "black"
    }
    footerComponent: Rectangle {
        color: "black"
    }
    contentComponent: ListView {
        delegate: Rectangle { width: parent.width; height: 40; color: "green" }
       model: 10
    }
}
```


## 全局单例模式

1. 入口文件的 `id` 和属性

2. 静态 JavaScript 文件

3. qml 单例，QML 实现

4. qml 单例，c++ 实现

5. 注册上下文属性

## 货币展示

```
/**
 * places 保留几位有效小数
 * symbol 法币符号
 * thousand 每千为分隔符
 * decimal 数与小数分隔符
 */
Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
      places = !isNaN(places = Math.abs(places)) ? places : 2;
      symbol = symbol !== undefined ? symbol : "$";
      thousand = thousand || ",";
      decimal = decimal || ".";
      var number = this,
          negative = number < 0 ? "-" : "",
          i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
          j = (j = i.length) > 3 ? j % 3 : 0;
      return symbol + negative + (j ? i.substr(0, j) + thousand : "")
      + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand)
      + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
  };

var revenue = 12345678;
console.log(revenue.formatMoney()); // $12,345,678.00
console.log(revenue.formatMoney(0, "HK$ ")); // HK$ 12,345,678
```


