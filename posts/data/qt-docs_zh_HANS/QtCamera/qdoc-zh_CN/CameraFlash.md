# QtMultiMedia 之 CameraFlash

> 翻译：qyvlik

> 5.5.1

控制相机闪光灯的接♂口♀。

## 属性

+ `mode`      : `enumeration`

+ `ready`     : `bool`

## 信号

+ `flashModeChanged(int)`

+ `flashReady(bool)`

## 详细描述

This type allows you to operate the camera flash hardware and control the flash mode used. Not all cameras have flash hardware (and in some cases it is shared with the torch hardware).

这个类提供了相机闪光灯的控制模式，并不是所有的相机都有闪光灯模块（可能是手电筒模块）。

It should not be constructed separately, instead the flash property of a Camera should be used.

这个类型不可创建，只能通过 `Camera::flash` 属性来访问。

```
Camera {
    id: camera

    exposure.exposureCompensation: -1.0
    flash.mode: Camera.FlashRedEyeReduction
}
```

## 属性文档

> `mode`      : `enumeration`

This property holds the camera flash mode.

闪光灯的闪烁模式。

The mode can be one of the following:

| Value | Description |
|:-----:|:-----------:|
|Camera.FlashOff | Flash is Off. |
|Camera.FlashOn | Flash is On. |
|Camera.FlashAuto | Automatic flash. |
|Camera.FlashRedEyeReduction | Red eye reduction flash. |
|Camera.FlashFill | Use flash to fillin shadows. |
|Camera.FlashTorch | Constant light source. If supported, torch can be enabled without loading the camera. |
|Camera.FlashVideoLight | Constant light source, useful for video capture. The light is turned on only while the camera is active. |
|Camera.FlashSlowSyncFrontCurtain | Use the flash in conjunction with a slow shutter speed. This mode allows better exposure of distant objects and/or motion blur effect. |
|Camera.FlashSlowSyncRearCurtain | The similar mode to FlashSlowSyncFrontCurtain but flash is fired at the end of exposure. |
|Camera.FlashManual | Flash power is manually set. |

有如下值（本人才疏学浅，某些语句不能翻译，以后补上，请谅解。）：

| 值 | 描述 |
|:-----:|:-----------:|
|Camera.FlashOff | 关闭闪光灯 |
|Camera.FlashOn | 打开闪光灯 |
|Camera.FlashAuto | 自动模式 |
|Camera.FlashRedEyeReduction | 消除红眼 |
|Camera.FlashFill | Use flash to fillin shadows. |
|Camera.FlashTorch | 手电筒模式，如果系统支持的话，可以不用加载相机只用这个模式。 |
|Camera.FlashVideoLight | 录像常量模式，只能在相机加载后支持的情况下使用。 |
|Camera.FlashSlowSyncFrontCurtain | Use the flash in conjunction with a slow shutter speed. This mode allows better exposure of distant objects and/or motion blur effect. |
|Camera.FlashSlowSyncRearCurtain | The similar mode to FlashSlowSyncFrontCurtain but flash is fired at the end of exposure. |
|Camera.FlashManual | Flash power is manually set. |

> `ready`     : `bool`

This property indicates whether the flash is charged.

这个值表示闪光灯是否充电完毕（应该是是否可用吧）。

## 信号文档

`flashModeChanged(int)`

This signal is emitted when the flashMode property is changed. The corresponding handler is onFlashModeChanged.

在修改闪光模式时触发。

`flashReady(bool)`

This signal is emitted when `QCameraExposure` indicates that the flash is ready to use. The corresponding handler is onFlashReadyChanged.

在 `QCameraExposure` 指示 `flash` 可用时，就会触发此信号。
