# 在Windows7上编译QtAudioEngine模块

> 作者 [qyvlik](http://blog.qyvlik.space)

Compile QtAudioEngine on windows.

QtAudioEngine 是一个使用 OpenAL 技术的三维音效模块。OpenAL 多用于游戏场景中的音效，主要模拟场景的立体性。

> 系统：Window 7 32 bits, Qt 5.6 rc, OpenAL 版本：1.1, 编译 QtAudioEngine  版本为 1.0

分为如下步骤：

1. 下载 [OpenAL11CoreSDK](http://www.openal.org/downloads/OpenAL11CoreSDK.zip)，**默认安装到 `C` 盘**，这个为开发包。

2. 下载 [OpenAL 1.1 Windows Installer](http://www.openal.org/downloads/oalinst.zip)，**默认安装到 `C` 盘**，这个是运行在系统上 OpenAL。

3. 安装 Qt 的 MinGW 版本，**Qt 版本 大于 5.0**。这里本人使用最新的 Qt 5.6 rc 版本，刚刚发布的。安装 Qt 时，安装选项全选，至少要**安装源码**，默认安装到 C 盘。

4. 准备编译

    a. 打开 Qt 安装路径，找到路径`你的Qt安装路径\5.6\Src\qtmultimedia\src\imports\audioengine`，我的是 `C:\Qt\Qt5.6.0\5.6\Src\qtmultimedia\src\imports\audioengine`。

    b. 找到 `audioengine.pro` 使用 `QtCreator` 打开，没错我们不直接用 `qmake`，直接使用 `QtCreator` 来编译。

    c. 打开后，选定平台为 `Windows`。打开 `audioengine.pro` 注释掉 `win32: LIBS += -lOpenAL32` 在 `pro` 最后面部分添加如下代码：

    ```
    win32: LIBS += -L$$PWD/'../../../../../../../../Program Files (x86)/OpenAL 1.1 SDK/libs/Win32/' -lOpenAL32
INCLUDEPATH += $$PWD/'../../../../../../../../Program Files (x86)/OpenAL 1.1 SDK/include'
    ```

    注意，这里的 `LIBS ` 和 `INCLUDEPATH `，为第一步安装的 `OpenAL11CoreSDK` 开发包的路径下的库路径和头文件路径，此外，必须使用 `$$PWD` 作为前缀，使用相对路径的方式，一级一级向上跳，不能使用绝对路径。

    d. 由于上一步的头文件路径为与 `qaudioengine_openal_p.h` 的第 58 ，59 行的头文件引入有出入，故需要修改源代码。

    源代码第 58 ，59 行原来如下：

    ```
    #include <AL/al.h>
    #include <AL/alc.h>
    ```

    修改为：
  
    ```
    #include <al.h>
    #include <alc.h>
    ```
    
    既去掉 `AL` 文件夹。

    e. 编译前，将项目的设定为构建，去掉**影子构建**（Shadow build）的选项。
    
5. 开始编译模块

    点击构建，生成的 `dll` 文件其实是在 `你的Qt安装路径\5.6\Src\qtmultimedia\qml\QtAudioEngine` 下，我的是在 `C:\Qt\Qt5.6.0\5.6\Src\qtmultimedia\qml\QtAudioEngine` 下。一共有四个文件，分别为 `declarative_audioengine.dll`，`declarative_audioengined.dll`，`libdeclarative_audioengine.a`，`libdeclarative_audioengined.a`。

6. 安装模块

    先将 `你的Qt安装路径\5.6\Src\qtmultimedia\src\imports\audioengine` 下的 `plugins.qmltypes` 和 `qmldir` 复制到 `你的Qt安装路径\5.6\Src\qtmultimedia\qml\QtAudioEngine`，我的是 `C:\Qt\Qt5.6.0\5.6\Src\qtmultimedia\src\imports\audioengine` 下的 `plugins.qmltypes` 和 `qmldir` 复制到 `C:\Qt\Qt5.6.0\5.6\Src\qtmultimedia\qml\QtAudioEngine`下。

    然后将整个 `QtAudioEngine` 文件夹，复制到 `你的Qt安装路径\5.6\mingw49_32\qml`，我的是 `C:\Qt\Qt5.6.0\5.6\mingw49_32\qml`。这一步算得上是安装模块了。

7. 运行官方例子

    然后代开 `QtCreator`，在例子一栏输入 `audioengine` 就可以找到 `QtAudioEngine` 例子了，打开后，你会发现是一个 `pro` 工程，但是并不能运行，选中 `pro` 文件，右键打开 `pro` 文件所在路径，找到 `qml` 文件夹，进入 `qml` 文件夹，打开 `*.qmlproject` 文件（这个是纯 QML 项目的项目文件），然后运行，就可以看到效果了。

---

1. 有关于安装路径，安装路径可以不按照本文中所说的，安装到 C 盘。

2. 不同 Qt 版本编译出来的 `QtAudioEngine ` 可以在其他版本上 `Qt` 使用，具体使用方法是参照本文第 6 步，先安装，后使用。

---

参考 [[SOLVED] Audio Engine module not present in Qt 5.3.2 windows installation](https://forum.qt.io/topic/46210/solved-audio-engine-module-not-present-in-qt-5-3-2-windows-installation/4)
