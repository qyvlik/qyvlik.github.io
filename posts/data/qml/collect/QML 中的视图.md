# QML 中的视图

> 作者 [qyvlik](http://blog.qyvlik.space)

`TableView`，`ListView`，`GridView`，`PathView`，这些 **View** 会对视图进行优化，也就是当可见项（**数据展示项**）在看不到的地方就会销毁，这也是 **View** 为何可以显示无限个的**数据展示项**（硬盘为上限，每个**数据展示项**不能太大，一次能显示的**数据展示项**个数在合理范围）。

先看看如下代码：

```
ListView {
    model: 1000000 // 这里表示有一百万个数据
    delegate: Text {text: index}    // 显示数据
}
```

你会发现，如果真的要渲染一百万个 `Text`，机身内存是吃不消的，所以在显示上会做优化，也就是看不到的**数据展示项**，就不创建，当**数据展示项**超出视图时，就会被销毁。

在看看如下代码：

```
ListView {
    model: 1000000 // 这里表示有一百万个数据
    delegate: CheckBox { }
}
```

这里显示了一百万个 `CheckBox`，每个 `CheckBox` 都可以保存自己的被选中的状态 `checkable`。但是就如上面所说的，**数据展示项**在超出可见范围就会被销毁。也就是**数据展示项**本身如果保存了数据，在销毁前没有保存的话，就会丢失。

所以解决的办法也很简单，另外构建一个数组，按照顺序保存这些 `CheckBox` 的状态值。

具体项目代码可以查看 [ImageExplorer/ImageExplorerPage.qml](https://github.com/qyvlik/QtQuickAppDemo/blob/master/ImageExplorer/Component/ImageExplorer/ImageExplorerPage.qml) 第 89 行，以及第 139 行和 143 行。

由于相册显示使用了 `GridView`，如果每个图片展示项（**数据展示项**）都放一个 `CheckBox` 那么，**数据展示项**超出视图时，就会被销毁。也就不能保存你选择了哪些图片。所以构建一个 `ListModel` 或者数组保存这些数据即可。
