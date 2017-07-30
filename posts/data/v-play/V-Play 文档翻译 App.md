# V-Play 文档翻译 App

> 翻译：qyvlik

V-Play 应用的最顶层控件，用以管理其他控件。

> VPlayApps 1.0

> Inherits: ApplicationWindow

## 属性

+ `diameterInInches` : `real`

+ `dpScale` : `real`

+ `heightInInches` : `real`

+ `landscape` : `bool`

+ `licenseKey` : `string`

+ `portrait` : `bool`

+ `spScale` : `real`

+ `tablet` : bool`

+ `uiScale` : `real`

+ `widthInInches` : `real`

## 信号

+ `applicationPaused()`

+ `applicationResumed()`

+ `initTheme()`

+ `splashScreenFinished()`

## 方法

+ `dp(value)`

+ `physicalPixels(pixel)`

+ `pixelToInches(pixel)`

+ `px(value)`

+ `sp(value)`

## 详细描述

The `App` type is used to create the top-level item in a new V-Play application.

`App` 用以作为 V-Play 应用的顶层控件。

Every V-Play app begins with a single App component defined at the root of its hierarchy. Every app usually includes a single `Navigation` and some `Page` items.

每一个 V-Play 应用的第一层定义的控件都是一个 `App`。一般包含一个 `Navigation` 和数个 `Page`。

## 属性文档

> `diameterInInches` : `real` read-only

This read-only property holds the physical diameter of the screen in inches.

屏幕直径的物理尺寸，单位英寸。

You can use it for example to load different layouts based on the physical size.

可以根据这个来决定应用的布局和排版。

**Note**: The tablet property gets true if this property is bigger than 5.

**注意**： 如果这个属性的值大于 5 时，`tablet` 属性为真。

> `dpScale` : `real`

The scale factor all `dp()` values are multiplied with.

这个值作为 `dp()` 函数的因子。

The default value is 1.

默认值为 1。

> `heightInInches` : `real` read-only

This read-only property holds the physical height of the screen in inches.

屏幕高的物理尺寸，单位英寸。

You can use it for example to load different layouts based on the physical size.

可以根据这个来决定应用的布局和排版。

> `landscape` : `bool` read-only

This read-only property gets true if the device is held in portrait mode. This means, the width is bigger than the height.

应用是否处于横屏模式，为真时，一般是应用的高度小于应用的宽度。

You can use it for example to load different layouts if the device is in landscape mode.

可以根据这个来决定应用的布局和排版。

**Note**: If landscape is true, portrait will be false and vice versa.

**注意**：如果 `landscape` 为真，`portrait` 一般为假。

> `licenseKey` : `string`

许可证密钥。从 [http://v-play.net/license](http://v-play.net/license/) 可以获取更多信息。

> `portrait` : `bool` read-only

This read-only property gets true if the device is held in portrait mode. This means, the height is bigger than the width.

应用是否处于竖屏模式，为真时，一般是应用的高度大于应用的宽度。

You can use it for example to load different layouts if the device is in portrait mode.

可以根据这个来决定应用的布局和排版。

**Note**: If portrait is true, landscape will be false and vice versa.

**注意**：如果 `portrait` 为真，`landscape` 一般为假。

> `spScale` : `real`

The scale factor all `sp()` values are multiplied with.

作为 `sp()` 的因子。

The default value is 1.

默认值为 1。

> `tablet` : bool` read-only

This read-only property gets true if the screen's diameter is bigger than 5 inches.

只读属性，屏幕直径大于 5 英寸时，为真。

You can use it for example to load different layouts if the device is a tablet.

可以根据这个来决定应用的布局和排版。

> `uiScale` : `real`

The scale factor all `dp()` and `sp()` values are multiplied with.

作为 `dp()` 以及 `sp()` 的因子。

The default value is 1 on mobile and 2 on desktop platforms.

手机上的默认值为 1，电脑上的默认值为 2。

> `widthInInches` : `real` read-only

This read-only property holds the physical width of the screen in inches.

屏幕宽的物理尺寸，单位英寸。

You can use it for example to load different layouts based on the physical size.

可以根据这个来决定应用的布局和排版。

## 信号文档

> `applicationPaused()`

This signal is emitted when the application is paused. This occurs when the app is moved into the background after pressing the Home button. It is also called when the app is left because the user answers a phone call for example, or when the user locks the screen.

在应用暂停时触发，一般是屏幕切回系统主界面，应用退至后台。在应用退出时也会触发，例如用户接电话或者用户关闭屏幕。

The corresponding handler is `onApplicationPaused`.

信号处理方式为 `onApplicationPaused`。

Use this handler to store any app-related data you want to save persistently and should be available to the user after the app is resumed.

用这个处理器来处理和保存应用相关的数据，一般应用重新运行时可以使用。

If the app got destroyed after the pause, you can then restore the old state when the application starts with `Component.onCompleted()` or in `applicationResumed` in case the app was not destroyed but still in the OS memory.

如果应用在暂停后被销毁，可以保存旧的状态以便在应用运行时触发 `Component.onCompleted()` 恢复，或者应用被销毁但是仍然保留在系统内存中时，重新运行时在 `applicationResumed` 中恢复。

**Note**: For quick testing of the functionality on desktop systems, you can minimize the application.

**注意**：为了在桌面系统上快速测试这个功能，直接最小化应用即可。

As an example, you could put the app into a pause scene once the application is paused. The pause scene could contain a resume button, so the user has enough time to continue with the app after he left the application.

上文的 **pause scene** 不知为何物，自行理解，科科。

> `applicationResumed()`

This signal is emitted when the application is resumed after a previous `applicationPaused` call. It is not called when the application is first started - for this initialization, use the `Component.onCompleted()` handler.

此信号会在应用触发 `applicationPaused` 后，再次运行时触发。并不会在应用首次启动时触发，如果是为了初始化应用，请将初始化代码写在 `Component.onCompleted()`。

The corresponding handler is `onApplicationResumed`.

信号处理方式为 `onApplicationResumed`。

Use this handler for example to load a previously saved app state. The applicationResumed signal may be called multiple times in an application's lifetime.

 这个信号的处理器可以恢复上次保存的状态。在应用生命周期中 `applicationResumed` 会被触发多次。

> `initTheme()`

Implement this signal handler to override the app's default theme values on app start. For more information have a look at the `Theme` global object.

重新实现这个信号处理器，在应用启动时覆盖应用默认的主题配置。更多详细信息请查看 [`Theme`]()。

> `splashScreenFinished()`

This handler gets called when the V-Play splash screen was shown and now faded out. It is also called if the license does not require a splash screen, initially at game startup. You can then continue with your game logic in `onSplashScreenFinished`: ....

这个信号在 V-Play 启动屏显示然后渐渐淡出时触发。如果没有申请授权令牌也会在启动屏淡出后触发。在游戏最初启动时，你可以在 `onSplashScreenFinished` 里完成一些逻辑。

**Note**: A splash screen is only shown in the V-Play [Starter License](http://v-play.net/pricing) or if you did not set any `licenseKey`. Upgrade to one of the other licenses to hide the splash screen.

**注意**：反正你去申请一个授权令牌就可以去掉这个 SplashScreen 了。地址 [Starter License](http://v-play.net/pricing)，可以免费申请。

## 方法文档

> `dp(value)`

Returns the density-independent unit for this pixel `value`.

返回一个依赖分辨率密度的像素值。

This allows you to define the same physical size for Item elements across platforms and screens with different densities.

反正这个 `dp()` 函数允许你为 `Item` 定义一个可以跨平台和跨屏幕的尺寸。

**DPI Examples**

The dp value is calculated with the following formula: `dp = pixel * screenDpi / 160`.

`dp` 值依靠如下公式进行计算：`dp = pixel * screenDpi / 160`。

This means:

- On a 160 dpi screen like the iPhone 3 (non-retina display), the pixel value of 1 will return 1 dp unit.

- On a 320 dpi screen like the iPhone 4 (retina display), the pixel value of 2 will return 1 dp unit.

大概意思就是：

- 在 160 dpi 的屏幕上，例如 IPhone 3 （非视网膜屏幕），参数为 1 ，返回像素值为 1。

- 在 320 dpi 的屏幕上，例如 IPhone 4 （视网膜屏幕），参数为 2 ，返回像素值为 1。

虽然传入的像素值不一样，但是返回的物理尺寸一样。

160 dp equals 1 inch. You can calculate the inch value from the pixel value with pixelToInches().

160 dp 等于 1 英寸。你可以使用 `pixelToInches(pixel)` 函数来算得英寸。

**Note**: The recommended button height is 48dp. This equals 3/10 of an inch or 0.8 centimeters.

**注意**：建议按钮的高度为 48 dp。大概等于 0.3 英寸或者 0.8 厘米。

You can modify the result of all dp() function calls by changing the `dpScale` or `uiScale` properties.

你可以通过修改 `dpScale` 或者 `uiScale` 属性来修改 `dp(values)` 返回的值。

**Example Usage**

```
import VPlayApps 1.0
import QtQuick 2.0

App {
  id: app

  Rectangle {
    width: parent.width
    height: app.dp(48)

    Text {
      text: "20sp"
      font.pixelSize: app.sp(20)
    }
  }
}
```

Also see the guide [Density Independence Support: dp, sp, pixelToInches, tablet, orientation]() for more information on density independence. The Android Developers Guide about [Supporting Multiple Screens](http://developer.android.com/guide/practices/screens_support.html) is also a great read to better understand density independence, as the same concepts of Android are used in V-Play.

查看  [Density Independence Support: dp, sp, pixelToInches, tablet, orientation]() 获取更多有关屏幕分辨率和尺寸的信息。安卓开发者可以查看 [Supporting Multiple Screens](http://developer.android.com/guide/practices/screens_support.html)，以便更好的理解屏幕分辨率和尺寸。

> `physicalPixels(pixel)`

Returns the pixel value multiplied with the `devicePixelRatio` of the screen.

通过与屏幕的 `devicePixelRatio` 值相乘以获取屏幕的物理像素值。

On iOS & Mac devices, the reported screen size of App is a virtual point size. To get the real pixels of the screen, a multiplication with devicePixelRatio is needed.

在苹果和 Mac 上，应用的尺寸是以一个虚拟的点数代替。可以通过与屏幕的 `devicePixelRatio` 值相乘以获取屏幕的物理像素值。

You will mostly not need this value, but it may be useful for debug output or certain scenarios.

大多数时候，你可能不会用到这个，但是在调试的时候非常有用。

Note: The physicalPixels value of the screen is used in V-Play to choose the default [V-Play File Selectors]() to support [Dynamic Image Switching]().

**注意**：查看 [V-Play File Selectors]() 来支持动态切换不同尺寸的图片 [Dynamic Image Switching]()。

> `pixelToInches(pixel)`

Returns the value in inches from the pixel value.

返回像素的英寸数值。

You can use the inch value for example to load different layouts based on the physical size.

可以根据这个来决定应用的布局和排版。

> `px(value)`

内部函数。

> `sp(value)`

Returns the density-independent unit for this pixel `value`. Only use this function for `Text` element `font.pixelSize` values.

返回一个依赖分辨率密度的像素值。一般是用以在 `Text` 的 `font.pixelSize` 的属性。

This allows you to define the same physical size for `Text` elements across platforms and screens with different densities.

反正这个 `sp()` 函数允许你为 `Text` 定义一个可以跨平台和跨屏幕的尺寸。

**DPI Examples**

The dp value is calculated with the following formula: `dp = pixel * screenDpi / 160`.

`dp` 值依靠如下公式进行计算：`dp = pixel * screenDpi / 160`。

This means:

- On a 160 dpi screen like the iPhone 3 (non-retina display), the pixel value of 1 will return 1 dp unit.

- On a 320 dpi screen like the iPhone 4 (retina display), the pixel value of 2 will return 1 dp unit.

大概意思就是：

- 在 160 dpi 的屏幕上，例如 IPhone 3 （非视网膜屏幕），参数为 1 ，返回像素值为 1。

- 在 320 dpi 的屏幕上，例如 IPhone 4 （视网膜屏幕），参数为 2 ，返回像素值为 1。

虽然传入的像素值不一样，但是返回的物理尺寸一样。

160 dp equals 1 inch. You can calculate the inch value from the pixel value with pixelToInches().

160 dp 等于 1 英寸。你可以使用 `pixelToInches(pixel)` 函数来算得英寸。

**Note**: The recommended button height is 48dp. This equals 3/10 of an inch or 0.8 centimeters.

**注意**：建议按钮的高度为 48 dp。大概等于 0.3 英寸或者 0.8 厘米。

You can modify the result of all dp() function calls by changing the `dpScale` or `uiScale` properties.

你可以通过修改 `dpScale` 或者 `uiScale` 属性来修改 `dp(values)` 返回的值。

**Note**: The only difference to `dp()` is that you have a different `spScale` value available to change the scale factor of `Text` elements. You could read the user settings for font sizes of the system and change it accordingly. This is done by default for native Android applications - you could implement this function yourself by querying the user font settings and then changing the `spScale` value.

**注意**：不同于 `dp()`，你可以使用 `spScale` 值来修改 `Text` 的缩放因子。从设置中读取字体大小，相应的改变 `Text` 的字体大小。在原生安卓上有个默认的做法，就是实现一个函数，用以获取用户的设置的字体大小，然后修改 `spScale`。

You could also use the `spSale` to allow users change the font size in your app at runtime, for example with a slider in a settings page.

允许用户在应用运行期间通过修改 `spSale` 来改变字体大小。例如在一个设置页，通过一个滑块来控制字体大小。

**Example Usage**

```
import VPlayApps 1.0
import QtQuick 2.0

App {
  id: app

  Rectangle {
    width: parent.width
    height: app.dp(48)

    Text {
      text: "20sp"
      font.pixelSize: app.sp(20)
    }
  }
}
```

Also see the guide [Density Independence Support: dp, sp, pixelToInches, tablet, orientation]() for more information on density independence. The Android Developers Guide about [Supporting Multiple Screens](http://developer.android.com/guide/practices/screens_support.html) is also a great read to better understand density independence, as the same concepts of Android are used in V-Play.

查看  [Density Independence Support: dp, sp, pixelToInches, tablet, orientation]() 获取更多有关屏幕分辨率和尺寸的信息。安卓开发者可以查看 [Supporting Multiple Screens](http://developer.android.com/guide/practices/screens_support.html)，以便更好的理解屏幕分辨率和尺寸。
