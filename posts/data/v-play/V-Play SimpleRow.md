# V-Play SimpleRow

> 翻译 [qyvlik](http://blog.qyvlik.space)

`AppListView` 的默认代理。

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