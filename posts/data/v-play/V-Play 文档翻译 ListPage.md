# V-Play 文档翻译 ListPage

> 翻译：qyvlik

应用的一个页面。

> VPlayApps 1.0

> Inherits: Page

## 属性

+ `compactSections` : `bool`

+ `delegate` : `alias`

+ `emptyText` : `alias`

+ `emptyView` : `alias`

+ `listView` : `alias`

+ `model` : `var`

+ `pullToRefreshHandler` : `alias`

+ `pullToRefreshHandler`. : `PullToRefreshHandler`

+ `section` : `alias`

## 信号

+ `itemSelected(int index, var item)`

## 详细描述

The `ListPage` component is a convenience item wrapping a single `AppListView` component into a `Page` object. It also contains a `PullToRefreshHandler`, which can be activated by setting `pullToRefreshHandler.pullToRefreshEnabled`. It is disabled by default in a `ListPage`.

由一个 `AppListView` 内嵌到 `Page` 所组成，也包含一个 `PullToRefreshHandler`。默认不可用。

A lot of app screens consist just of a single `AppListView`, therefore this component can save some boilerplate code.

由于内含一个 `AppListView`，可以减少一些重复代码。

The contained `listView` comes pre-initialized with a `delegate` of type `SimpleRow`. If the `section` features are used, the `SimpleSection` type is used as the default section delegate.

使用 `SimpleRow` 作为 `listView` 的 `delegate`，使用 `SimpleSection` 作为默认的 `section`。

## 属性文档

> `compactSections` : `bool`

当时分段标题（section）时，允许切换内部的 `SimpleSection` 的样式。可以通过 `SimpleSection::style.compactStyle` 设置。

> `delegate` : `alias`

An alias to access and set the `ListView::delegate` data.

内部的 `ListView::delegate` 的引用。

> `emptyText` : `alias`

An alias to access and set the `AppListView::emptyText` data.

内部  `AppListView::emptyText` 的引用。

> `emptyView` : `alias`

An alias to access and set the `AppListView::emptyView` data.

内部  `AppListView::emptyView` 的引用。

> `listView` : `alias`

An alias to access the component's `AppListView` child.

内部  `AppListView::listView` 的引用，用来访问 `AppListView` 的孩子。

> `model` : `var`

The model to be used for the `ListView::model` data.

内部  `AppListView::model` 的引用。

> `pullToRefreshHandler` : `alias`

An alias to a `PullToRefreshHandler` item inside the `AppListView`.

内部  `AppListView` 的 `PullToRefreshHandler` 引用。

Activate it by setting `pullToRefreshEnabled` to true and connecting the `refresh` signal.

设置 `PullToRefreshHandler::pullToRefreshEnabled` 为真，然后连接 `refresh` 信号。

```
    emptyText.text: qsTr("下拉更新")

    pullToRefreshHandler.pullToRefreshEnabled: listView.contentY <= 0
    pullToRefreshHandler.onRefresh: {
        pullToRefreshHandler.refreshing = true;
        // async....
        doALongLoading(function(){
            pullToRefreshHandler.refreshing = false;
        })
    }
```

> `section` : `alias`

An alias to access and set the `ListView::section` configuration to display a `ListView` with sections. The `ListPage` uses the `SimpleSection` type as the `ListView::section.delegate` by default.

内部 `ListView::section` 的引用。

**Note**: Usually, only a `model` based on the `ListModel` type supports sections. `ListPage` automatically uses the `AppListView::prepareArraySections` function to allow sections also for arrays.

**注意**：通常情况下，`model` 只支持 `ListModel`，来显示 `section`。但是 `ListPage` 会自动使用 `AppListView::prepareArraySections` 来处理，然后显示 `section`。

使用方法如下：

```
ListPage {
  model: [{ type: "Fruits", text: "Banana" },
    { type: "Fruits", text: "Apple" },
    { type: "Vegetables", text: "Potato" }]
  section.property: "type"
}
```

## 信号文档

> `itemSelected(int index, var item)`

This convenience handler gets called when a row within the contained listView was selected.

点击列表中某一项时触发。

**Note**: This is only called if the delegate is not overridden by a custom `delegate`.

**注意**：这个信号，只有在没有重写 `delegate` 的情况下有效。（其实就是使用 `SimpleRow` 来实现的）