# V-Play 文档翻译 AppListView

> 翻译 [qyvlik](http://blog.qyvlik.space)

提供原生的滚动指示器，一个空的视图和横向滑动手势（类似 QQ 界面的对某个对话项右滑而出现的菜单）。

> VPlayApps 1.0

> Inherits: ListView

## 属性

+ `backgroundColor` : `color`

+ `emptyText` : `AppText`

+ `emptyView` : `Item`

+ `scrollIndicatorVisible` : `bool`

## 方法

+ `getScrollPosition()`

+ `prepareArraySections(data)`

+ `restoreScrollPosition(data, numNewItemsOnTop)`

## 详细描述

AppListView is an extension of the basic QML `ListView` with functionality for the V-Play AppSDK.

It adds capability for displaying a view when the list is empty, and for using `SwipeOptionsContainer` as `ListView::delegate`.

To use predefined components for often used list features, use a `PullToRefreshHandler` and/or `VisibilityRefreshHandler` together with the `AppListView`.

Thus we recommend using AppListView instead of ListView in your whole project.

大体就是提供更多功能的 `ListView`，例如支持下拉更新，上拉加载更多等，推荐在项目中使用 `AppListView` 替代 `ListView`。

### 基本用法

**Simple AppListView**

The easiest way to to use the `AppListView` is by choosing the `SimpleRow` type as the `ListView::delegate`. If the model is an array, the `SimpleRow` properties are automatically initialized with the matching array properties.

下述是一个使用 `SimpleRow` 配合 `AppListView` 的例子。

```
AppListView {
  delegate: SimpleRow {}
  model: [
    { text: "Widget test",
      detailText: "Some of the widgets available in V-Play AppSDK",
      icon: IconType.tablet },
    { text: "Shown are:",
      detailText: "ListPage, NavigationBar with different items, Switch",
      icon: IconType.question }
  ]
}
```

Using a model based on the `ListModel` type is also possible:

也可以使用 `ListModel`：

```
AppListView {
  model: ListModel {
    ListElement { name: "Banana" }
    ListElement { name: "Apple" }
    ListElement { name: "Potato" }
  }
  delegate: SimpleRow { text: name }
}
```

### AppListView with Sections

Similar to the QML `ListView` type, sections are created by specifying a `ListView::section.property` and `ListView::section.delegate`. Just use the `SimpleSection` type as the delegate to get a default section look that matches the underlying platform style.

类似于 `ListView`，可以使用 `ListView::section.property` 和 `ListView::section.delegate` 创建章节指示器。可以使用 `SimpleSection` 作为默认控件。

```
AppListView {
  model: ListModel {
    ListElement { type: "Fruits"; name: "Banana" }
    ListElement { type: "Fruits"; name: "Apple" }
    ListElement { type: "Vegetables"; name: "Potato" }
  }
  delegate: SimpleRow { text: name }

  section.property: "type"
  section.delegate: SimpleSection { }
}
```

Note: Sections are only available if the `ListView::model` is based on the `ListModel` type. To create sections for an array model, use the `AppListView::prepareArraySections` function.

## 属性文档

> `backgroundColor` : `color`

> `emptyText` : `AppText`

> `emptyView` : `Item`

> `scrollIndicatorVisible` : `bool`

## 方法文档

> `getScrollPosition()`

> `prepareArraySections(data)`

> `restoreScrollPosition(data, numNewItemsOnTop)`
