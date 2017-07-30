# Qt5 编译 glfw3

> windows7

> Qt 5.5.1

> [glfw 3.1.2](https://github.com/glfw/glfw)

由于 glfw 是直接使用 `cmake` 构建的。所以我们直接使用 `QtCreator` 打开 `glfw` 目录下的 `CMakeLists.txt`。然后进行配置。

接下来，先看看有哪些文件是被 `cMakeLists.txt` 包含进项目的，把这些源文件条目记录下来，手动构建一个 `pri` 文件来保存这些源文件条目（好傻是不是）。

懒的同学，就直接看下面的代码吧：

```

DEFINES += _GLFW_USE_CONFIG_H

HEADERS += \
    $$PWD/glfw-3.1.2/deps/glad/glad.h \
    $$PWD/glfw-3.1.2/deps/getopt.h \
    $$PWD/glfw-3.1.2/deps/tinycthread.h \
    $$PWD/glfw-3.1.2/include/GLFW/glfw3.h \
    $$PWD/glfw-3.1.2/include/GLFW/glfw3native.h \
    $$PWD/glfw-3.1.2/src/internal.h \
    $$PWD/glfw-3.1.2/src/wgl_context.h \
    $$PWD/glfw-3.1.2/src/win32_platform.h \
    $$PWD/glfw-3.1.2/src/win32_tls.h \
    $$PWD/glfw-3.1.2/src/winmm_joystick.h \
    $$PWD/glfw-3.1.2/src/glfw_config.h

SOURCES += \
    $$PWD/glfw-3.1.2/deps/getopt.c \
    $$PWD/glfw-3.1.2/deps/glad.c \
    $$PWD/glfw-3.1.2/deps/tinycthread.c \
    $$PWD/glfw-3.1.2/src/init.c \
    $$PWD/glfw-3.1.2/src/input.c \
    $$PWD/glfw-3.1.2/src/monitor.c \
    $$PWD/glfw-3.1.2/src/wgl_context.c \
    $$PWD/glfw-3.1.2/src/win32_init.c \
    $$PWD/glfw-3.1.2/src/win32_monitor.c \
    $$PWD/glfw-3.1.2/src/win32_time.c \
    $$PWD/glfw-3.1.2/src/win32_tls.c \
    $$PWD/glfw-3.1.2/src/win32_window.c \
    $$PWD/glfw-3.1.2/src/window.c \
    $$PWD/glfw-3.1.2/src/winmm_joystick.c \
    $$PWD/glfw-3.1.2/src/context.c
```

记住，要去 `glfw-3.1.2-build\src` 目录下找到 cmake 生成的 `glfw_config.h`
