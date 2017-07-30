# QML 的多线程处理

> 作者 [qyvlik](http://blog.qyvlik.space)

## WorkerScript

由于 `WorkerScript` 的设计问题，为了完全隔绝在 `WorkerScript` 线程中读取到主线程的上下文，所以除了 `ListModel`，只能进行值传递，并且 `WorkerScript` 没有有效的注册机制，将 `C++` 的计算能力注入到 `WorkerScript` 中。

## 需求

## QmlThread

成果：[thread_in_qml](https://github.com/qyvlik/QmlThread/blob/master/thread_in_qml/README.md)。

讨论地址 [QML 下的多线程](http://qtdream.com/topic/533/qml-%E4%B8%8B%E7%9A%84%E5%A4%9A%E7%BA%BF%E7%A8%8B)。