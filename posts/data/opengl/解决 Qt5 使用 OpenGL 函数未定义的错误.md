# 解决 Qt5 使用 OpenGL 函数未定义的错误

> 作者 [qyvlik](http://blog.qyvlik.space)

> windows7, Qt 5.5.1

## 函数未定义

> undefined reference to `xxx`

函数未定义一直以来是大多数 c++ 编译出错的问题之一。

一般是有如下几个原因：

1. 有函数声明，并在其他地方使用到了这个函数，但是没有提供函数定义，链接出错。

2. 有函数声明，并在其他地方使用到了这个函数，但是没有提供函数定义的 `.a`，`.lib`，`.dll`，`.so` 这些库文件，链接出错。

> 编译是将头文件和源文件编译为 `.o` 文件。链接是将多个 `.o` 文件合并成一个 `.exe` 文件。

## OpenGL 函数

Qt5 把 OpenGL 1~4 的版本的接口自己封装了，所以很多第三方库的 gl 函数在 Qt 编译环境下都无法 link 到。

给出如下神秘的代码：

```
win32-g++:!contains(QMAKE_HOST.arch, x86_64) {
    LIBS += "C:/Program Files (x86)/Microsoft SDKs/Windows/v7.1A/Lib/OpenGL32.lib"
} else {
    LIBS += "C:/Program Files (x86)/Microsoft SDKs/Windows/v7.1A/Lib/x64/OpenGL32.lib"
}
```

在 pro 文件中直接链接这些库。注意 `C:/Program Files (x86)/Microsoft SDKs/Windows` 这个路径下可能有多个版本的 `Libs`，如 `v7.0A`，`v7.1A` 等等，找到有 `Libs` 文件夹的那个路径进行替换就行了。

其他平台类似吧，不过还是尽可能使用 Qt 官方封装的 gl 函数吧。

## 以一及百

一般有许多的 `DGI` 函数，编译时，Qt 都没有直接 link，都可以用上诉方法处理，不过，在编译一些第三方库时再用吧。

---

[Qt linker Error on HWND, HDC](http://stackoverflow.com/questions/5562712/qt-linker-error-on-hwnd-hdc)

[undefined reference to错误的解决方法](http://blog.csdn.net/cserchen/article/details/5503556)
