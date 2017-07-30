# V-Play 文档翻译 Theme

> 翻译：qyvlik

定义应用主题样式的全局对象。

> VPlayApps 1.0

> Inherits: Item

## 属性

+ `appButton` : `ThemeAppButton`

+ `appCheckBox` : `ThemeAppCheckBox`

+ `backgroundColor` : `color`

+ `boldFont` : `QtObject`

+ `colors` : `ThemeColors`

+ `disabledColor` : `color`

+ `disclosureColor` : `color`

+ `dividerColor` : `color`

+ `inputCursorColor` : `color`

+ `inputSelectionColor` : `color`

+ `isAndroid` : `bool`

+ `isDesktop` : `bool`

+ `isIos` : `bool`

+ `isLinux` : `bool`

+ `isOSX` : `bool`

+ `isPortrait` : `bool`

+ `isWinPhone` : `bool`

+ `isWindows` : `bool`

+ `listItem` : `ThemeSimpleRow`

+ `listSection` : `ThemeSimpleSection`

+ `listSectionCompact` : `ThemeSimpleSection`

+ `navigationAppDrawer` : `ThemeNavigationAppDrawer`

+ `navigationBar` : `ThemeNavigationBar`

+ `normalFont` : `QtObject`

+ `placeholderTextColor` : `color`

+ `platform` : `string`

+ `secondaryBackgroundColor` : `color`

+ `secondaryTextColor` : `color`

+ `selectedBackgroundColor` : `color`

+ `statusBarHeight` : `int`

+ `statusBarStyle` : `int`

+ `tabBar` : `ThemeTabControl`

+ `textColor` : `color`

+ `tintColor` : `color`

## 方法

+ `reset()`

## 详细描述

All apps created with V-Play Apps ship with a default style which follows platform-specific attributes.

使用平台特定属作为 V-Play 应用默认样式。

For most flexibility it's however also possible to overwrite these styles by your own. The most basic example is changing the background color of a navigation bar within a `NavigationStack` item.

你可以重写这些样式，让你的应用看起来更加的顺眼。如下是一个基本例子，如何设置 `NavigationStack` 的导航条颜色。

To change a theme-able property implement the `App::initTheme` signal handler and overwrite the values like in this example:

请在 `App::initTheme` 的信号处理器中重新设置 `Theme` 的样式：

```
import VPlayApps 1.0

App {
  onInitTheme: {
    // Set the navigation bar background to a shiny blue
    Theme.navigationBar.backgroundColor = "blue"

    // Set the global text color to a dark blue
    Theme.colors.textColor = "#000080"
  }
}
```

**Note**: You can change theme-able properties at any given time from within your app's code, not only in the App::initTheme handler. The recommended approach is however to use the given handler for setting a default style at app start.

**注意**：其实你可以在应用代码中的任何地方重新设置 `Theme` 的属性，修改样式。这里的建议是，在应用启动时提供一个默认的样式。

## 属性文档

> `appButton` : `ThemeAppButton`

You can override sub-properties of the appButton property to set the global appearance of `AppButton` items.

你可以通过设置 `appButton` 的属性来让所有的 `AppButton` 使用同一个样式。

Following properties can be overridden:

如下的属性可以被重写：

+ `appButton.backgroundColor`: The background color defines the fill of every AppButton.

    按钮背景颜色。

+ `appButton.backgroundColorPressed`: The background color when the button is pressed.

    按钮按下后的背景颜色。

+ `appButton.disabledColor`: The disabled color defines the fill of every AppButton when in disabled state.

    按钮处于不可用时的背景颜色。

+ `appButton.textColor`: The text color of the text displayed as label of the button.

    按钮文本的颜色

+ `appButton.flatTextColor`: The text color of the text displayed as label of the button if `AppButton::flat` is set to true.

    如果 `AppButton::flat` 为真时，设置文本的颜色。

+ `appButton.flatTextColorPressed`: The text color of the text if the button is pressed and AppButton::flat is set to true.

    如果 `AppButton::flat` 为真时，设置按钮按下后文本的颜色。

+ `appButton.textColorDisabled`: The text color of the text if the button is disabled.

    按钮处于不可用时的文本颜色。

+ `appButton.borderColor`: The color of the border of the button.

    按钮的边框颜色。

+ `appButton.borderColorPressed`: The color of the border of the button if it is pressed.

    按钮按下时的边框颜色。

+ `appButton.borderColorDisabled`: The color of the border of the button if it is disabled.

    按钮处于不可用时的边框颜色。

+ `appButton.borderWidth`: The width of the border of the button.

    按钮的边框宽度。

+ `appButton.radius`: The corner radius of the button.

    按钮的圆角大小。

+ `appButton.textSize`: The size of the button's text.

    按钮文本的大小。

+ `appButton.fontCapitalization`: The Text::font.capitalization setting of the button.

    按钮文本的大小写模式。

+ `appButton.fontBold`: Whether the button text should be bold.

    按钮文本字体是否加粗。

+ `appButton.minimumHeight`: The minimum height of the button.

    按钮的最小高度。

+ `appButton.minimumWidth`: Specifies the minimum AppButton width if AppButton::flat is set to false.

    按钮的最小宽度。

+ `appButton.flatMinimumWidth`: Specifies the minimum AppButton width if `AppButton::flat` is set to true.

    如果 `AppButton::flat` 为真时，按钮的最小宽度。

+ `appButton.horizontalPadding`: The horizontal padding around the button's text.

    按钮内，文本水平方向的内边距。

+ `appButton.verticalPadding`: The vertical padding around the button's text.

    按钮内，文本竖直方向的内边距。

+ `appButton.horizontalMargin`: The margin to the left and right of the button.

    按钮内，文本水平方向的外边距。

+ `appButton.verticalMargin`: The margin at the top and the bottom of the button.

    按钮内，文本竖直方向的外边距。

+ `appButton.dropShadow`: Whether a drop shadow should be added to the button.

    是否绘制按钮的阴影。

> `appCheckBox` : `ThemeAppCheckBox`

> `backgroundColor` : `color`

> `boldFont` : `QtObject`

> `colors` : `ThemeColors`

> `disabledColor` : `color`

> `disclosureColor` : `color`

> `dividerColor` : `color`

> `inputCursorColor` : `color`

> `inputSelectionColor` : `color`

> `isAndroid` : `bool`

> `isDesktop` : `bool`

> `isIos` : `bool`

> `isLinux` : `bool`

> `isOSX` : `bool`

> `isPortrait` : `bool`

> `isWinPhone` : `bool`

> `isWindows` : `bool`

> `listItem` : `ThemeSimpleRow`

> `listSection` : `ThemeSimpleSection`

> `listSectionCompact` : `ThemeSimpleSection`

> `navigationAppDrawer` : `ThemeNavigationAppDrawer`

> `navigationBar` : `ThemeNavigationBar`

> `normalFont` : `QtObject`

> `placeholderTextColor` : `color`

> `platform` : `string`

> `secondaryBackgroundColor` : `color`

> `secondaryTextColor` : `color`

> `selectedBackgroundColor` : `color`

> `statusBarHeight` : `int`

> `statusBarStyle` : `int`

> `tabBar` : `ThemeTabControl`

> `textColor` : `color`

> `tintColor` : `color`

## 方法文档

