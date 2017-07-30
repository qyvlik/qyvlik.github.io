# V-Play 文档翻译 HomePullToRefreshHandler

> 翻译：qyvlik

列表页面的下拉更新。

> VPlayApps 1.0

> Inherits: Item

## 属性

+ `contentColor` : `color`

+ `listView` : `ListView`

+ `pullToRefreshEnabled` : `bool`

+ `refreshing` : `bool`

## 信号

+ `refresh()`

## 详细描述

This item is a convenience item that can be added as `header` of an `AppListView` to implement a pull-to-refresh behavior.

作为 `header` 添加到 `AppListView`，用以实现下拉更新。

The item emits the `refresh` signal as soon as the user pulls the containing list view down until a certain pull threshold is reached.

当用户向下拉动列表时，然后释放时，就会触发 `refresh` 信号。

This reload pattern is often used in apps that display a time-sorted feed of content items.

在应用中很常见的一个功能。

As an example you can load the next 20 tweets in your `Twitter` app as soon as a user reaches the top of the feed, as shown in the following sample:

例如你在 `Twitter` 应用中，使用如下类似代码可以添加新的 20 条推文。

```
AppListView {
  PullToRefreshHandler {
    onRefresh: twitterClient.loadNextTweets()
  }
}
```

## 属性文档

> `contentColor` : `color`

The color of the indicator icons displayed behind the list content while pulling or refreshing.

在下拉或者刷新时，加载指示器的背景颜色。

> `listView` : `ListView`

The `AppListView` this item belongs to. This property is set automatically as soon as the item gets set as the header or footer of an `AppListView`.

在设置为 `header` 或者 `footer` 时，其依附的 `AppListView`。

> `pullToRefreshEnabled` : `bool`

Set to `false` to disable pull-to-refresh. By default this property is set to true and therefore visible on top of the list view.

是否允许下拉更新，设置为 `false` 就不可以使用这个功能。

> `refreshing` : `bool`

Set this to `true` as long as your content is refreshing. The indicator will stay docked as long as refreshing is `true`.

设置为 `true` 时，表示还在加载，如果设置为 `false`，就不会显示加载指示器。

```
AppListView {
    emptyText.text: qsTr("下拉更新")

    pullToRefreshHandler.pullToRefreshEnabled: listView.contentY <= 0
    pullToRefreshHandler.onRefresh: {
        pullToRefreshHandler.refreshing = true;
        // async....
        doALongLoading(function(){
            pullToRefreshHandler.refreshing = false;
        })
    }
}
```

## 信号文档

> `refresh()`

Emitted as soon as the item got pulled and released again. You can take appropriate actions to handle the data reload or load more items for your list.

当用户向下拉动列表时，然后释放时，就会触发 `refresh` 信号。
