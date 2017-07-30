# Configuring

配置

Open a build shell (on Windows open an MSVC command prompt, on other platforms you can usually open the default shell):

打开构建命令行（Windows 中打开 `MSVC` 的命令行，在其他平台打开默认命令行）并输入如下命令：

```
qbs setup-toolchains --detect
```

The tool chain detector automatically sets up a profile for each detected tool chain. You can list the existing profiles by running:

工具链检测器会为每个检测工具链自动建立一个文档简介。你可以罗列出所有存在的文件简介：

```
qbs config --list profiles
```

Now you should be ready to build your first project with Qbs. Go into qbs/tests/manual/hello and type:

现在你应该可以使用 Qbs 构建你第一个项目了。转至 `qbs/tests/manual/hello` 路径，输入如下命令：

```
qbs profile:<profile name>
```

If you want to build projects that use Qt, additional steps are necessary. Please refer to [Managing Qt Versions](http://doc-snapshots.qt.io/qbs/qt-versions.html) for more information.

如果你想使用 Qt 来构建项目，还有一些必要的步骤要做。更多信息请参考[Managing Qt Versions](http://doc-snapshots.qt.io/qbs/qt-versions.html)。
