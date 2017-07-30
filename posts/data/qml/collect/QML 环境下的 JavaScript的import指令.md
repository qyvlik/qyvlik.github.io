# QML 环境下的 JavaScript的import指令

> 作者 [qyvlik](http://blog.qyvlik.space)

回顾之前的 [QML 中的 Qt.include](QML 中的 Qt.include.md)。在一个 `JavaScript` 文件中引用其他 `JavaScript` 文件的方式。

这提供另一种方式导入 `JavaScript` 库的方式。

## 使用 `.import` 指令导入其他 `JavaScript` 文件

```
//~ stdio.js

function printf(str) {
    console.log(str);
}

var std = new Object();
std.name = "stdio::std"
```

```
//~ main.js

.import "./stdio.js" as Stdio

function main() {
    Stdio.printf("this prinft function was define in stdio.js");
    printf(Stdio.std.name);        // 这里可以直接使用 stdio.js 文件中的 std 对象。
}
```

如上所示，通过 `.import` 语法导入一个 `JavaScript` 文件，这个文件所有的对象和方法都会归纳到 `Stdio` 这个名字空间（其实也是一个对象）。但是 `Stdio` 这个名字控件并不会归纳到 `main.js` 中。

如下代码，无论是通过 `Qt.include` 进行包含，或者使用 `.import` 进行导入，无法访问 `main.js` 中的 `Stdio`，也无法访问 `stdio.js` 的方法，

```
//~ foo.js
Qt.include('main.js');

main();
//! Stdio 这个名字控件只在 `main.js` 中有效。
Stdio.printf("call stdio::printf from foo.js");
```

此外如果 `stdio.js` 声明为静态库的话，使用在 `JavaScript` 中使用 `.import` 和在 `QML` 文档中使用 `import` 语法的效果是一样，只会加载一次。但是使用 `Qt.include` 进行导入的话，就会加载多次。

## 使用 `.import` 导入 `QML` 模块

`JavaScript` 的 `.import` 指令可以导入 `QML` 模块，访问 `QML` 模块中的枚举和单例。

> 注意，在 `qmlproject` 工程中，使用 `.import` 指令导入一个使用 `qmldir` 定义的模块时，无法访问到 `QML` 类型和单例，但是定义的模块内 `JavaScript` 文件却可以访问。