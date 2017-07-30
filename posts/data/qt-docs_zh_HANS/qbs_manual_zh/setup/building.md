# Building

构建

To build Qbs, enter the following command:

输入如下命令构建 Qbs。

```
qmake -r qbs.pro && make
```

## Configure Options

配置选项

Qbs recognizes the following qmake CONFIG options to customize the build:

Qbs 识别如下 `qmake` 配置选项来个性化构建：

| Option | Notes |
|--------|-------|
| qbs_enable_unit_tests | Enable additional autotests. |
| qbs_disable_rpath | Disable the use of rpath. This can be used when packaging Qbs for distributions which do not permit the use of rpath, such as Fedora. |
| qbs_no_dev_install | Exclude header files from installation, that is, perform a non-developer build. |
| qbs_enable_project_file_updates | Enable API for updating project files. This implies a dependency to the Qt GUI module. |


