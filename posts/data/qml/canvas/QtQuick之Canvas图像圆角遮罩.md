# QtQuick之Canvas图像圆角遮罩

对于圆角图片处理，主要使用了四种办法来实现

1. Qt里面使用QPainter来画个

2. QML里面使用opengles来渲染

3. 使用原始图片和备用图片来合成

4. 使用QML-Canvas来渲染

发现前两种无论如何画出来的还是有些锯齿，虽然设置了抗锯齿，效果不明显.

第三种，图片合成，主要是采用图片与图片的z值来产生那种效果，但是一旦换肤就显而易见的有问题.

第四种比较满意，效果还不错.

先说第一种:

代码：

```cpp
void YibanImage::paintEvent(QPaintEvent *)
{
    QPainter painter(this);
    painter.setPen(Qt::gray);
    painter.setRenderHint (QPainter::HighQualityAntialiasing,true);
    painter.drawEllipse(0, 0, 52, 52);
    QPixmap icon(currentFileName);

    QImage fixedImage(52, 52, QImage::Format_ARGB32_Premultiplied);

    fixedImage.fill(0);  // Make sure you don't have garbage in there

    QPainter imgPainter(&fixedImage);
    QPainterPath clip;
    clip.addEllipse(0, 0, 52, 52);  // this is the shape we want to clip to
    imgPainter.setRenderHint(QPainter::HighQualityAntialiasing,true);
    imgPainter.setClipPath(clip);
    imgPainter.drawPixmap(0, 0, 52, 52, icon);
    imgPainter.end();
    painter.drawPixmap(0, 0, 52, 52, QPixmap::fromImage(fixedImage));
}
```

设置了高质量抗锯齿，但是发现还是有锯齿，有心人可以修正，再此谢过
第二种：

```qml
import QtQuick 2.1
import "../openglTxt.js" as MyOpenglTxt

/* ImageScope - Scope a Image
 * property string source
 *          Image source
 * property real magnification
 *          magnification of image (>0)
 * property int scopeX / scopeY
 *          position of scope
 * property real radius
 *          radius of scope
 *
 * ImageScope {
 *   width: 50; height: 50
 *   source: "sample.img"
 *   radius: width / 2
 *   scopeX: 30; scopeY: 20
 * }
 */
Item {
    id: imgScope

    property real magnification: 1.0
    property int scopeX: 0
    property int scopeY: 0
    property real radius: 0

    // interImage aliases
    property alias fillMode: interImage.fillMode
    property alias horizontalAlignment: interImage.horizontalAlignment
    property alias mirror: interImage.mirror
    property alias paintedHeight: interImage.paintedHeight
    property alias paintedWidth: interImage.paintedWidth
    property alias progress: interImage.progress
    property alias smooth: interImage.smooth
    property alias source: interImage.source
    property alias sourceSize: interImage.sourceSize
    property alias status: interImage.status
    property alias verticalAlignment: interImage.verticalAlignment

    Image {
        id: interImage
        visible: false
        fillMode: Image.PreserveAspectFit
        width: sourceSize.width * magnification
        height: sourceSize.height * magnification
        antialiasing: true
    }
    ShaderEffect {
        id: effect
        anchors.fill: parent
        antialiasing: true
        implicitWidth: interImage.sourceSize.width
        implicitHeight: interImage.sourceSize.height

        property Image _image: interImage
        property real _w: width / interImage.width
        property real _h: height / interImage.height
        property real _rX: radius / interImage.width / _w
        property real _rY: radius / interImage.height / _h
        property real _cX: scopeX / interImage.width
        property real _cY: scopeY / interImage.height

        fragmentShader: MyOpenglTxt.openglStr

    }
}
```

opengles语句如下：

```
var openglStr = 
"
varying highp vec2 qt_TexCoord0;\
uniform sampler2D _image;
uniform lowp float qt_Opacity;
uniform highp float _w;
uniform highp float _h;
uniform highp float _cX;
uniform highp float _cY;
uniform highp float _rX;
uniform highp float _rY;

// square float
highp float sq(float a)
{
    return a * a;
}

void main() {
    lowp float opacity = qt_Opacity;
    highp float x = qt_TexCoord0.x;
    highp float y = qt_TexCoord0.y;

    if(x <= _rX && y <= _rY
            && sq(x - _rX) / sq(_rX) + sq(y - _rY) / sq(_rY) > 1.0)
        opacity = 0.0;
    if(x <= _rX && y >= 1.0 - _rY
            && sq(x - _rX) / sq(_rX) + sq(y - 1.0 + _rY) / sq(_rY) > 1.0)
        opacity = 0.0;
    if(x >= 1.0 - _rX && y <= _rY
            && sq(x - 1.0 + _rX) / sq(_rX) + sq(y - _rY) / sq(_rY) > 1.0)
        opacity = 0.0;
    if(x >= 1.0 - _rX && y >= 1.0 - _rY
            && sq(x - 1.0 + _rX) / sq(_rX) + sq(y - 1.0 + _rY) / sq(_rY) > 1.0)
        opacity = 0.0;

    x = x * _w + _cX; y = y * _h + _cY;
    if(x < 0.0 || x > 1.0 || y < 0.0 || y > 1.0) opacity = 0.0;

    gl_FragColor = texture2D(_image, vec2(x, y)) * opacity;
}
"
```

主要使用的opengles着色器来做，发现四周瑕疵万千，有心人可以修正.

第三种不在此赘述，因为实际用不到.

第四种：

```qml
import QtQuick 2.0

Item {
    id:mainRect
    width: 72
    height: 72
    property string canvasimg: "qrc:/image/mainui/4.png"
    property color mystroke: "#D74F37"
    Canvas {
        id: canvas
        width: parent.width; height: parent.height
        property real hue: 0.0
        onPaint: {
              var ctx = getContext("2d")
                    ctx.lineWidth = 4
                    // store current context setup
                    ctx.save()
                    ctx.strokeStyle = mystroke;
                    ctx.beginPath()
                    ctx.arc(mainRect.width/2, mainRect.height/2, mainRect.width/2, 0, Math.PI * 2, true);
                    ctx.closePath()
                    ctx.clip()  // create clip from triangle path
                    // draw image with clip applied
                    ctx.drawImage(canvasimg, 0, 0)
                    // draw stroke around path
                    ctx.closePath()
                    ctx.stroke()
                    // restore previous setup
                    ctx.restore()
                }
                Component.onCompleted: {
                    loadImage(canvasimg)
                }
    }
    function repaintUI()
    {
        canvas.requestPaint();
    }
}
```

这里定义了2个对外属性 一个是图片资源，一个是画笔的色值。

最后一个js方法就是使用Canvas的repaint方法，因为初始化的时候对其赋值，需要重新刷新一遍。

基于以上四种方法，感觉第四种比较好点，能够成功应用于实际项目中，另外Canvas的语法也很蛋疼，对于html的Canvas要多少了解才能好处理。

[原文](http://blog.csdn.net/esonpo/article/details/37762239)
