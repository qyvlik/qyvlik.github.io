# QML中的Qt.include

> 作者 [qyvlik](http://blog.qyvlik.space)

这个函数是在一个 `JavaScript` 文件中直接包含其他 `JavaScript` 文件的函数。

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
Qt.include("./stdio.js");

function main() {
    printf("this prinft function was define in stdio.js");
    printf(std.name);        // 这里可以直接使用 stdio.js 文件中的 std 对象。
}
```

如上所示，被包含的 `JavaScript` 中的对象名，函数名等，会直接归纳到 `main.js` 中。

假设还有一个 `foo.js` 文件导入了 `mian.js`，由于 `main.js` 中 `include` 了 `stdio.js`，所以 `foo.js` 即可以访问 `main.js` 中定义的对象和方法，又可以访问 `stdio.js` 中定义的方法和对象。及 `Qt.include` 的语义和 `C/C++` 的 `include`  指令类似的。

```
//~ foo.js
Qt.include('main.js');

main();
printf("call stdio::printf from foo.js");
```

> 注意：如果 `stdio.js` 声明为静态库，既文档开头有 `.pragma library`。如果以 `Qt.include` 的方式进行导入，则静态库声明失效，会重复加载。如果在 `JavaScript` 中以 `.import` 的方式加载，就会保持 `stdio.js` 的静态性。

如果在 `main.qml` 中使用 `import` 导入 `main.js`，也是可以访问到 `stdio.js` 里面的对象的。

```
//~ main.qml

import QtQuick 2.0
import "main.js" as Main

Item {
    Component.onCompleted: { 
        console.log(Main.std.name);
    }
}
```

## 在 JavaScript 中实现宏操作

由于 `Qt.include` 会将目标代码的直接复制到调用的地方，语言与 `C/C++` 类似。所以可以使用 `typeof FunctionName == 'undefined'` 来仿制宏。

先来看看代码：

```
//~ A.js
Qt.include("./B.js");

function A() {
    console.log("i'am A: printf B", B)
}
```

```
//~ B.js
Qt.include("./A.js");

function B() {
    console.log("i'am B: printf B", A);
}
```

当 `A.js` 与 `B.js` 相互引用时，程序是无法加载这些代码的。他们之间相互包含。

根据 `include` 的语义，使用函数名是否等于 `undefined` 来判断是否加载了某个对应的 `js` 文件。

> 注意，使用函数名来处理更好，因为函数名是定义行为，而对象名是执行行为，既在执行 `Qt.include` 这个操作前，函数定义已经完成，而对象名定义未完成。
> 而且对象名需要赋值（执行行为）才可以有意义，否则对象的默认值是 `undefined`。

修改如下：

```
//~ A.js
console.log("start----A:")

if(typeof B == "undefined") {
    console.log("A will include B");
    Qt.include("./B.js");
}

function A() {
    console.log("i'am A: printf B", B)
}

A();

console.log("end----A:")
```

```
//~ B.js
console.log("start----B:")

if(typeof A == "undefined") {
    console.log("B will include A")
    Qt.include("./A.js");
}

function B() {
    console.log("i'am B: printf B", A);
}

B();

console.log("end----B:")
```

