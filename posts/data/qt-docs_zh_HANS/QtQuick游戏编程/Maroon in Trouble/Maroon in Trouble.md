# Qt Quick Demo - Maroon in Trouble

Qt Quick 示例 - Maroon in Trouble

![](images\Maroon-in-Trouble01.png)

Maroon in Trouble 展示了在开发游戏时 QML 的特性的好用之处：

Maroon in Trouble demonstrates QML features that are useful when developing games:``

* 在游戏的不同状态中，使用自定义 QML 类型创建不同的场景（屏幕）。

- Using custom QML types to create different screens for different stages of the game.

* 使用 `Item` 和 `Image` 构建游戏背景。

- Using the Item and Image types to construct a game background.

* 使用 SequentialAnimation，NumberAnimation，ParticleSystem，Emitter 和 Wander 来移动背景对象。

- Using the SequentialAnimation, NumberAnimation, ParticleSystem, Emitter, and Wander types to animate background objects.

* 使用 `Timer` 和 `Repeater` 来展示游戏开始前的倒计时。

- Using the Timer and Repeater types to display a countdown sequence before starting the game.

* 使用自定义 QML 类型来构造游戏。

- Using a custom QML type with custom properties to construct a game board.

* 使用 `SpriteSequence` 和 `Sprite` 来添加动画对象到游戏中去。

- Using the SpriteSequence and Sprite types to add animated objects to the game board.

* 使用 `Image` 和自定义属性来构造自一个购买栏菜单。

- Using a custom QML type that uses the Image type with some custom properties to add a menu where the players can buy objects.

* 使用自定义属性和私有函数来跟踪游戏数据，使用自定义 `QML` 类来展示游戏数据。

- Using custom properties with private functions to keep track of game statistics and a custom QML type to display them to the players.

* 使用 `State` 和 `JavaScript` 函数来管理游戏状态。

- Using the State type with JavaScript functions to manage game states.

* 使用 `SoundEffect` 来播放角色音效。

- Using the SoundEffect type to play individual sound effects depending on the object type and the action applied to the object.

* 使用信号处理器来处理特定的快捷键，响应游戏动作。

- Using signal handlers to specify keyboard shortcuts for some game actions.

* 使用资源文件包游戏资源，便于发布和交付。

- Using resource files to package game resources for deployment and delivery.

## Running the Example

运行例子

从 Qt Creator 中运行这个例子，打开欢迎界面在示例中选中这个例子。更多信息，查看 [Building and Running an Example]()。

To run the example from Qt Creator, open the Welcome mode and select the example from Examples. For more information, visit Building and Running an Example.

## Adding Screens

添加屏幕

在 **Maroon in Trouble** 中，我们使用如下的自定义类型来创建游戏屏幕。

In the Maroon in Trouble app, we use the following custom types that are each defined in a separate .qml file to create the game screens:

* NewGameScreen.qml

* GameCanvas.qml

* GameOverScreen.qml

为了使用这些自定义类型，在入口 `QML` 文件 `maroon.qml` 使用 `import` 来导入 `content` 文件夹，代码如下：

To use the custom types, we add an import statement to the main QML file, maroon.qml that imports the folder called content where the types are located:

```qml
import "content"
```

在不同的游戏状态使用不同类型的屏幕。`NewGameScreen` 被用来创建游戏开始时的欢迎界面。在 `NewGameScreen.qml` 里，我们使用 `Image` 来场景一个 **New Game** 按钮，让玩家可以开始新游戏。

We use the screen types at different stages of the game. The NewGameScreen type is used to create the screen that appears when the players start the app. In NewGameScreen.qml, we use an Image type to create a New Game button that the players can press to start a new game.

![](images\Maroon-in-Trouble02.png)

利用按钮启动倒计时来触发 `GameCanvas` 创建游戏画布。其他 `Timer` 来产生带气泡的反派鱼，玩家必须在他们抵达水面前打破他的气泡。玩家可以点击游戏屏幕打开一个菜单，菜单中他们可以购买不同类型的武器(melee, ranged, and bombs)，来打破气泡。

Tapping the button initiates a countdown timer that triggers the creation of the game canvas by using the GameCanvas type. Another Timer type spawns mobs of fish inside bubbles that the players must free before they reach the surface. The players can tap on the screen to open a menu where they can buy different types of weapons (melee, ranged, and bombs) to burst the bubbles.

![](images\Maroon-in-Trouble01.png)

当游戏结束时，会通过 `GameOverScreen` 来创建一个屏幕。在这个屏幕，玩家可看到他们的得分和 `New Game` 的按钮。

When the game finishes, a screen created by using the GameOverScreen type appears. On this screen, the players can see their score and start a new game.

![](images\Maroon-in-Trouble03.png)

这些屏幕都创建在同一个背景，使用同样的图片和动画。

The screens are all created on the same background and use some of the same images and animations.

## Constructing the Background

创建背景

在 `marron.qml`,根元素使用 `Item` ，如下修正其高度和宽度：

In the maroon.qml file, we use an Item type with the id root and a fixed width and height to create a main window for the game:

```qml
Item {
    id: root
    width: 320
    height: 480
    property var gameState
    property bool passedSplash: false
```

我们为根元素声明了两个自定义属性，`gameState` 和 `passedSplash`，用于游戏状态管理。

We declare two custom properties for the root item, gameState and passedSplash that we will use later to manage game states.

使用 `Image` 来展示背景图片：

We use an Image item to display the game background image:

```qml
 Image {
        source:"content/gfx/background.png"
        anchors.bottom: view.bottom
```

在应用启动时，一次加载背景图片，使用不同游戏屏幕进行滚动切换。因此，`background.png` 是根项的长度的三倍，并显示一个从海的底部延伸至地平线的天空场景,。

We want to be able to load the background image only once at app startup and still use different scenes for the game screens. Therefore, background.png is three times the length of the root item and displays a scene that stretches from the bottom of sea to the sky above the horizon.

使用 `anchors,bottom` 属性定位背景图片的屏幕底部。

We use the anchors.bottom property to anchor the background image to the bottom of the Column layout that we use to position the screens:

```qml
    Column {
        id: view
        y: -(height - 480)
        width: 320

        GameOverScreen { gameCanvas: canvas }
```

在海洋底部这个位置，使用 y 属性设置第一个场景。通过减去屏幕高度来计算场景位置。


We set a negative value for the y property to set the first scene at the bottom of the sea. We calculate the position by subtracting the height of a screen from the height property.

在竖向布局中，我们将一个 Item 作为背景进行添加。在这个 item 中，使用一个横向布局来定位图片对象，它在游戏画布和游戏结束屏幕中显示波浪。

Within the column layout, we use an Item type to add objects to the background. Within the item, we use Row layout objects to position Image objects that display waves on the game canvas and the game over screen:

```qml
        Item {
            id: canvasArea
            width: 320
            height: 480

            Row {
                height: childrenRect.height
                Image {
                    id: wave
                    y: 30
                    source:"content/gfx/wave.png"
                }
                Image {
                    y: 30
                    source:"content/gfx/wave.png"
                }
    ...
            Row {
                opacity: 0.5
                Image {
                    id: wave2
                    y: 25
                    source: "content/gfx/wave.png"
                }
                Image {
                    y: 25
                    source: "content/gfx/wave.png"
                }
```

第二行的波浪在 y 轴方向上与第一行有些许间距。通过设置透明度这个属性让第一行的两个波浪看起来颜色淡一点，这样可以让背景有景深的效果。

The second row of waves is positioned on the y axis with a slight offset to the first row. We also use the opacity property to make the waves appear lighter in color than the first two waves, which gives the background some depth.

在游戏画布和游戏结束场景中，使用一个图片对象展示太阳：

We use Image objects to also display sunlight on the new game screen and on the game canvas:


```qml
            Image {
                source: "content/gfx/sunlight.png"
                opacity: 0.02
                y: 0
                anchors.horizontalCenter: parent.horizontalCenter
    ...
            Image {
                source: "content/gfx/sunlight.png"
                opacity: 0.04
                y: 20
                anchors.horizontalCenter: parent.horizontalCenter
```

设置图片的透明度为 0.02 到 0.04 之间，让太阳光线看起来更真实。使用 y 属性和 `anchors.horizontalCenter` 属性来定位图片。

We set the opacity property of the images to 0.02 and 0.04 to give some depth to the rays of sunshine. We use the y property to position the images at fixed locations on the y axis and the anchors.horizontalCenter property to center them horizontally in relation to their parent.

使用图片对象添加一个有层次阴影的图片到背景。

We use an Image type to display an image that adds a deepening shadow to the background:

```qml
            Image {
                source: "content/gfx/grid.png"
                opacity: 0.5
            }
```

设置图片的透明度为 0.5，使其显示在阴影的背后。

We set the opacity property of the image to 0.5 to make the background visible behind the shadow.

为了使背景更有趣，将添加一些动画对象。

To make the background more interesting, we animate some of the objects we added to it.

## Animating Background Objects

使用 NumberAnimation 来水平移动波浪

在屏幕中，使用 NumberAnimation 来垂直移动波浪，NumberAnimation 配合 SequentialAnimation 来上下移动波浪。

We use NumberAnimation to move the waves horizontally across the screen in opposite directions and SequentialAnimation with NumberAnimation to move them up and down.

将波浪 x 属性绑定到数字动画的值，定时 16 秒，范围从最近的值到 -(wave.width)。设置循环属性为 Animation.Infinite 来无限循环：

We apply the number animation to the x property of wave as a property value source to animate the x value from its current value to the -(wave.width), over 16 seconds. We set the loops property to Animation.Infinite to repeat the animation indefinitely:

```qml
           NumberAnimation on x { from: 0; to: -(wave.width); duration: 16000; loops: Animation.Infinite }
```



We apply the sequential animation to the y property of the image as a property value source to animate the y value. We use one number animation to animate the image from the y position of two below the value of y to two above it, over 1600 milliseconds. We use another number animation to subsequently animate the image in the opposite direction, again over 1600 milliseconds. The animation is repeated indefinitely:

```qml
                SequentialAnimation on y {
                    loops: Animation.Infinite
                    NumberAnimation { from: y - 2; to: y + 2; duration: 1600; easing.type: Easing.InOutQuad }
                    NumberAnimation { from: y + 2; to: y - 2; duration: 1600; easing.type: Easing.InOutQuad }
                }
```







