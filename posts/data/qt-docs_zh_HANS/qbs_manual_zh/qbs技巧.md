# qbs 技巧

常用代码

```
    cpp.defines: {
        if(qbs.buildVariant == "debug") {
            return "QBS_DEBUG";
        } else {
            // release
            return "QBS_RELEASE";
        }
    }

    cpp.cxxFlags:"-std=c++11"
```

```
    // 再编译的时候，会把文件丢到指定的路径
    Group {
        name: "Runtime resources"
        files: [
            "test/*"
        ]
        qbs.install: true
        // 不指明的话，就丢到启动路径下
        // qbs.installDir: "test"
    }
```

---

参考文档

[Qbs-Quick-Reference](http://wiki.qt.io/Qbs-Quick-Reference)