# QtMultiMedia 之 CameraExposure

> 翻译：qyvlik

> 5.5.1

用来控制 `Camera` 曝光设置的接口。

## 属性

+ `aperture`               : `real`

+ `exposureCompensation`   : `real`

+ `exposureMode`           : `enumeration`

+ `iso`                    : `int`

+ `manualAperture`         : `real`

+ `manualIso`              : `real`

+ `manualShutterSpeed`     : `real`

+ `meteringMode`           : `enumeration`

+ `shutterSpeed`           : `real`

+ `spotMeteringPoint`      : `QPointF`

## 方法

+ `setAutoAperture()`

+ `setAutoIsoSensitivity()`

+ `setAutoShutterSpeed()`

## 详细描述

CameraExposure allows you to adjust exposure related settings like aperture and shutter speed, metering and ISO speed.

It should not be constructed separately, instead the exposure property of the a Camera should be used.

`CameraExposure` 允许你调整曝光相关的设置，例如光圈，快门速度，测光模式，和 ISO （感光度）大小。

`CameraExposure` 只能通过 `Camera::exposure` 使用，不可直接创建。

```
Camera {
    id: camera

    exposure.exposureCompensation: -1.0
    exposure.exposureMode: Camera.ExposurePortrait
}
```

Several settings have both an automatic and a manual mode. In the automatic modes the camera software itself will decide what a reasonable setting is, but in most cases these settings can be overridden with a specific manual setting.

大部分设置都有自动模式和手动模式。在自动模式下，相机软件会自己决定使用合理的设置。这些自动模式设置不能覆盖手动模式设置。

For example, to select automatic shutter speed selection:

例如设置自动快门速度：

```
    camera.exposure.setAutoShutterSpeed()
```

Or for a specific shutter speed:

或者指定快门速度：

```
    camera.exposure.manualShutterSpeed = 0.01 // 10ms
```

You can only choose one or the other mode.

你只能二者取其一。

## 属性文档

> `aperture`               : `real`

This property holds the current lens aperture as an F number (the ratio of the focal length to effective aperture diameter).

保存最近一次的光圈值 `F`。

> `exposureCompensation`   : `real`

This property holds the adjustment value for the automatically calculated exposure. The value is in EV units.
 
曝光补偿，自动计算曝光值进行调整。 `EV` 单位。

> `exposureMode`           : `enumeration`

This property holds the camera exposure mode.

曝光模式。

The mode can be one of the following:

| Value | Description |
|:-----:|:-----------:|
| Camera.ExposureManual | Manual mode. |
| Camera.ExposureAuto | Automatic mode. |
| Camera.ExposureNight | Night mode. | 
| Camera.ExposureBacklight | Backlight exposure mode. |
| Camera.ExposureSpotlight | Spotlight exposure mode. |
| Camera.ExposureSports | Spots exposure mode. |
| Camera.ExposureSnow | Snow exposure mode. |
| Camera.ExposureBeach | Beach exposure mode. |
| Camera.ExposureLargeAperture | Use larger aperture with small depth of field. |
| Camera.ExposureSmallAperture | Use smaller aperture. |
| Camera.ExposurePortrait | Portrait exposure mode. |
| Camera.ExposureAction | Action exposure mode. Since 5.5 |
| Camera.ExposureLandscape | Landscape exposure mode. Since 5.5 |
| Camera.ExposureNightPortrait | Night portrait exposure mode. Since 5.5 |
| Camera.ExposureTheatre | Theatre exposure mode. Since 5.5 | 
| Camera.ExposureSunset | Sunset exposure mode. Since 5.5 |
| Camera.ExposureSteadyPhoto | Steady photo exposure mode. Since 5.5 |
| Camera.ExposureFireworks | Fireworks exposure mode. Since 5.5 | 
| Camera.ExposureParty | Party exposure mode. Since 5.5 | 
| Camera.ExposureCandlelight | Candlelight exposure mode. Since 5.5 | 
| Camera.ExposureBarcode | Barcode exposure mode. Since 5.5 | 
| Camera.ExposureModeVendor | The base value for device specific exposure modes. |

模式可能是如下的：

| 值 | 描述 |
|:-----:|:-----------:|
| Camera.ExposureManual | 手动模式 |
| Camera.ExposureAuto | 自动模式 |
| Camera.ExposureNight | 夜间模式 | 
| Camera.ExposureBacklight | 背光模式 |
| Camera.ExposureSpotlight | Spotlight exposure mode. |
| Camera.ExposureSports | 运动模式 |
| Camera.ExposureSnow | 雪景模式 |
| Camera.ExposureBeach | 沙滩模式 |
| Camera.ExposureLargeAperture | 模糊景深，大光圈模式 |
| Camera.ExposureSmallAperture | 小光圈 |
| Camera.ExposurePortrait	| 人脸模式 |
| Camera.ExposureAction | 动作模式 |
| Camera.ExposureLandscape | 风景模式 |
| Camera.ExposureNightPortrait | 夜晚肖像模式 |
| Camera.ExposureTheatre | 电影模式 Since 5.5 | 
| Camera.ExposureSunset | 黄昏模式 Since 5.5 |
| Camera.ExposureSteadyPhoto | 固定图片曝光模式 Since 5.5 |
| Camera.ExposureFireworks | 烟花模式 Since 5.5 | 
| Camera.ExposureParty | 聚会模式 Since 5.5 | 
| Camera.ExposureCandlelight | 烛光模式 Since 5.5 | 
| Camera.ExposureBarcode | 条形码模式 Since 5.5 | 
| Camera.ExposureModeVendor | （我母鸡啊）The base value for device specific exposure modes. |

> `iso`                    : `int`

This property holds the sensor's ISO sensitivity value.

设置 ISO 感光度。

> `manualAperture`         : `real`

This property holds the aperture (F number) value for capturing photos.

If the value is less than zero, the camera automatically determines an appropriate aperture value.

aperture, setAutoAperture()

保存了捕获图片后的光圈值 `F`。

如果光圈值小于 0，那么相机会自动设置光圈值。

> `manualIso`              : `real`

This property holds the ISO settings for capturing photos.

If a negative value is specified, the camera will automatically determine an appropriate value.

See also iso and setAutoIsoSensitivity().

保存了捕获图片后的 ISO 值。

如果设置了错误的值，相机将会自动调整一个合适的值。

> `manualShutterSpeed`     : `real`

This property holds the shutter speed value (in seconds). If the value is less than zero, the camera automatically determines an appropriate shutter speed.

shutterSpeed, setAutoShutterSpeed()

设置手动的快门速度（秒），如果小于 0，将会自动设置一个合适的值。

> `meteringMode`           : `enumeration`

This property holds the camera metering mode (how exposure is balanced).

测光模式。

The mode can be one of the following:

| 值 | 描述 |
|:-----:|:-----------:|
| Camera.MeteringMatrix | A matrix of sample points is used to measure exposure. |
| Camera.MeteringAverage | An average is used to measure exposure. |
| Camera.MeteringSpot | A specific location (spotMeteringPoint) is used to measure exposure. |

可能为如下几种：

| 值 | 描述 |
|:-----:|:-----------:|
| Camera.MeteringMatrix | 使用样本的矩阵来测量曝光 |
| Camera.MeteringAverage | 使用平均值来测量曝光 |
| Camera.MeteringSpot | 使用指定值（spotMeteringPoint）来测量曝光 |

> `shutterSpeed`           : `real`

This property holds the camera's current shutter speed value in seconds. To affect the shutter speed you can use the manualShutterSpeed property and setAutoShutterSpeed().

保存最近一次快门速度（秒）。通过 `manualShutterSpeed` 和 `setAutoShutterSpeed()` 修改快门速度。

> `spotMeteringPoint`      : `QPointF`

The property holds the frame coordinates of the point to use for exposure metering. This point is only used in spot metering mode, and it typically defaults to the center (0.5, 0.5).

大体就是设置某个点为测试光源吧。。。。。。一般为中间点 `(0.5, 0.5)`。

## 方法文档

`setAutoAperture()`

Turn on auto aperture selection. The manual aperture value is reset to -1.0

打开自动光圈。手动光圈值重设为 `-1.0`。

`setAutoIsoSensitivity()`

Turn on auto ISO sensitivity selection. The manual ISO value is reset to -1.

打开自动感光度。手动感光度重设为 `-1`。

`setAutoShutterSpeed()`

Turn on auto shutter speed selection. The manual shutter speed value is reset to -1.0.

打开自动快门速度。手动快门速度重设为 `-1.0`。
