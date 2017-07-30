# qmldir 模块中的 JavaScript 文件

设有如下目录

```
| + MyModule
| | qmldir
| | MyObject.js
| main.qml
```

`qmldir` 中是这么写的

```
module MyModule
MyObject 1.0 ./MyObject.js
```

那么在 `main.qml` 中导入这个模块时，就可以通过 `MyObject` 这个具名对象来使用 `MyObject.js` 中定义的函数了。

如果 `MyObject.js` 声明为静态库的话，就相当于一个全局单例。

如果 `MyObject.js` 没有声明为一个静态库的话，那么会在每个引用这个对象的 `QML` 文档先实例化，一般是实例化多个（通过打印，会发现，一个 QML 文档加载时，会加载多次 `MyObject.js` 但是只会使用第一次实例化的 `MyObject.js`）。

此时使用没有声明为静态库的 JavaScript 文件，相当于实例化后 `QML` 对象的附属对象。