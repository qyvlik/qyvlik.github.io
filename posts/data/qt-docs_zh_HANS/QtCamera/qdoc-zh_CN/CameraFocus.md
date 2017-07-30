# QtMultiMedia 之 CameraFocus

> 翻译 [qyvlik](http://blog.qyvlik.space)

> 5.5.1

用来控制相机焦点的接口

## 属性

+ `customFocusPoint`  : `point`

+ `focusMode`         : `enumeration`

+ `focusPointMode`    : `enumeration`

+ `focusZones`        : `list<focusZone>`

## 方法

+ `bool isFocusModeSupported(mode)`

+ `bool isFocusPointModeSupported(mode)`

## 详细描述

This type allows control over manual and automatic focus settings, including information about any parts of the camera frame that are selected for autofocusing.

此类可以设置手动调焦或者自动聚焦。

It should not be constructed separately, instead the focus property of a Camera should be used.

不可直接创建，只能通过 `Camera::focus` 对象访问。

```
Item {
    width: 640
    height: 360

    Camera {
        id: camera

        focus {
            focusMode: Camera.FocusMacro
            focusPointMode: Camera.FocusPointCustom
            customFocusPoint: Qt.point(0.2, 0.2) // Focus relative to top-left corner
        }
    }

    VideoOutput {
        source: camera
        anchors.fill: parent
    }
}
```

## 属性文档

> `customFocusPoint`  : `point`

This property holds the position of custom focus point, in relative frame coordinates: QPointF(0,0) points to the left top frame point, QPointF(0.5,0.5) points to the frame center.

Custom focus point is used only in FocusPointCustom focus mode.

自定义焦点位置，与帧的坐标相关， `QPointF(0， 0)` 表示帧的左上角，`QPointF(0.5, 0.5)` 表示帧的中点。

自定义焦点只能在 `FocusPointCustom` 模式下起作用。

> `focusMode`         : `enumeration`

This property holds the current camera focus mode, which can be one of the following values:

| Value | Description |
|:-----:|:-----------:|
| FocusManual | Manual or fixed focus mode. |
| FocusHyperfocal | Focus to hyperfocal distance, with the maximum depth of field achieved. All objects at distances from half of this distance out to infinity will be acceptably sharp. |
| FocusInfinity | Focus strictly to infinity. |
| FocusAuto | One-shot auto focus mode. |
| FocusContinuous | Continuous auto focus mode. |
| FocusMacro | One shot auto focus to objects close to camera. |

该属性保存了相机的对焦模式，有如下值：

| 值 | 描述 |
|:-----:|:-----------:|
| FocusManual |手动模式 |
| FocusHyperfocal | Focus to hyperfocal distance, with the maximum depth of field achieved. All objects at distances from half of this distance out to infinity will be acceptably sharp. |
| FocusInfinity | Focus strictly to infinity. |
| FocusAuto | One-shot auto focus mode. |
| FocusContinuous | Continuous auto focus mode. |
| FocusMacro | One shot auto focus to objects close to camera. |

It's possible to combine multiple `Camera::FocusMode` values, for example `Camera.FocusMacro` + `Camera.FocusContinuous`.

可以将多个 `Camera::FocusMode` 联合起来，例如 `Camera.FocusMacro` + `Camera.FocusContinuous`。（话说不是使用 `|`？）

In automatic focusing modes, the focusPointMode property and focusZones property provide information and control over how automatic focusing is performed.

在自动聚焦模式下，`focusPointMode` 和 `focusZones` 为更好地聚焦提供了必要的信息。

> `focusPointMode`    : `enumeration`

This property holds the current camera focus point mode. It is used in automatic focusing modes to determine what to focus on. If the current focus point mode is `Camera.FocusPointCustom`, the `customFocusPoint` property allows you to specify which part of the frame to focus on.

点聚焦模式，默认使用自动聚焦模式来自行决定使用何种点聚焦模式。如果使用处于自定义点聚焦模式，`customFocusPoint` 属性允许为每一帧图像执行特定的聚焦点。

The property can take one of the following values:

| Value | Description |
|:-----:|:-----------:|
|FocusPointAuto | Automatically select one or multiple focus points. |
|FocusPointCenter | Focus to the frame center. |
|FocusPointFaceDetection | Focus on faces in the frame. |
|FocusPointCustom | Focus to the custom point, defined by the customFocusPoint property. |

可能的值如下：

| 值 | 描述 |
|:-----:|:-----------:|
|FocusPointAuto | 自动点聚焦模式 |
|FocusPointCenter | 中点聚焦模式 |
|FocusPointFaceDetection | 人脸识别点聚焦模式 |
|FocusPointCustom | 自定义点聚焦模式 |

> `focusZones`        : `list<focusZone>`

This property holds the list of current camera focus zones, each including area specified in the same coordinates as customFocusPoint, and zone status as one of the following values:

聚焦区域，每一个包含 `customFocusPoint` 的区域，可能的值如下：

| Value | Description |
|:-----:|:-----------:|
|Camera.FocusAreaUnused | This focus point area is currently unused in autofocusing. |
|Camera.FocusAreaSelected | This focus point area is used in autofocusing, but is not in focus. |
|Camera.FocusAreaFocused | This focus point is used in autofocusing, and is in focus. |

| 值 | 描述 |
|:-----:|:-----------:|
|Camera.FocusAreaUnused | 自动聚焦时未使用到此区域。 |
|Camera.FocusAreaSelected | 自动聚焦时使用到此区域，但是还未对区域聚焦。 |
|Camera.FocusAreaFocused | 自动聚焦时使用到此区域，且进行了聚焦。 |


```
VideoOutput {
    id: viewfinder
    source: camera

    //display focus areas on camera viewfinder:
    Repeater {
          model: camera.focus.focusZones

          Rectangle {
              border {
                  width: 2
                  color: status == Camera.FocusAreaFocused ? "green" : "white"
              }
              color: "transparent"

              // Map from the relative, normalized frame coordinates
              property variant mappedRect: viewfinder.mapNormalizedRectToItem(area);

              x: mappedRect.x
              y: mappedRect.y
              width: mappedRect.width
              height: mappedRect.height
          }
    }
}
```

## 方法文档

`bool isFocusModeSupported(mode) const`

Returns true if the supplied mode is a supported focus mode, and false otherwise.

检查某对焦模式是否可以使用。

`bool isFocusPointModeSupported(mode) const`

Returns true if the supplied mode is a supported focus point mode, and false otherwise.

检查某聚焦点模式是否可以使用。

