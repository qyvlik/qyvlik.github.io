# ListPage

> 翻译 [qyvlik](http://blog.qyvlik.space)

> VPlayApps 1.0

## 下拉更新

+ `pullToRefreshHandler` : `PullToRefreshHandler`

```
  pullToRefreshHandler {
    pullToRefreshEnabled: true
    onRefresh: loadNewTimer.start()
    refreshing: loadNewTimer.running
  }
```


