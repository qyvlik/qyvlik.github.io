# QtMultiMedia 之 Camera

> 翻译 [qyvlik](http://blog.qyvlik.space)

> 5.5.1

用于预览，拍摄，录像。

## 属性

+ `availability` : `enumeration`

+ `cameraState` : `enumeration`

+ `cameraStatus` : `enumeration`

+ `captureMode` : `enumeration`

+ `deviceId` : `string`

+ `digitalZoom` : `real`

+ `displayName` : `string`

+ `errorCode` : `enumeration`

+ `errorString` : `string`

+ `lockStatus` : `enumeration`

+ `maximumDigitalZoom` : `real`

+ `maximumOpticalZoom` : `real`

+ `mediaObject` : `variant`

+ `metaData`

    + `metaData.cameraManufacturer` : `variant`

    + `metaData.cameraModel` : `variant`

    + `metaData.event` : `variant`

    + `metaData.subject` : `variant`

    + `metaData.orientation` : `variant`

    + `metaData.dateTimeOriginal` : `variant`

    + `metaData.gpsLatitude` : `variant`

    + `metaData.gpsLongitude` : `variant`

    + `metaData.gpsAltitude` : `variant`

    + `metaData.gpsTimestamp` : `variant`

    + `metaData.gpsTrack` : `variant`

    + `metaData.gpsSpeed` : `variant`

    + `metaData.gpsImgDirection` : `variant`

    + `metaData.gpsProcessingMethod` : `variant`

+ `opticalZoom` : `real`

+ `orientation` : `int`

+ `position` : `enumeration`

+ `viewfinder`

    + `viewfinder.resolution` : `size`

    + `viewfinder.minimumFrameRate` : `real`

    + `viewfinder.maximumFrameRate` : `real`


## 信号

+ `cameraStateChanged(state)`

+ `digitalZoomChanged(zoom)`

+ `error(errorCode, errorString)`

+ `lockStatusChanged()`

+ `manualWhiteBalanceChanged(qreal)`

+ `maximumDigitalZoomChanged(zoom)`

+ `maximumOpticalZoomChanged(zoom)`

+ `opticalZoomChanged(zoom)`

+ `whiteBalanceModeChanged(Camera::WhiteBalanceMode)`

## 方法

+ `searchAndLock()`

+ `start()`

+ `stop()`

+ `list<object> supportedViewfinderFrameRateRanges(size resolution)`

+ `list<size> supportedViewfinderResolutions(real minimumFrameRate, real maximumFrameRate)`

+ `unlock()`

## 详细描述

You can use Camera to capture images and movies from a camera, and manipulate the capture and processing settings that get applied to the images. To display the viewfinder you can use VideoOutput with the Camera set as the source.

可以使用 `Camera` 拍照（捕获照片）或者录像。拍摄后可以对照片进行图像处理。可以使用 `VideoOutput` 来预览。

```
Item {
    width: 640
    height: 360

    Camera {
        id: camera

        imageProcessing.whiteBalanceMode: CameraImageProcessing.WhiteBalanceFlash

        exposure {
            exposureCompensation: -1.0
            exposureMode: Camera.ExposurePortrait
        }

        flash.mode: Camera.FlashRedEyeReduction

        imageCapture {
            onImageCaptured: {
                photoPreview.source = preview  // Show the preview in an Image
            }
        }
    }

    VideoOutput {
        source: camera
        anchors.fill: parent
        focus : visible // to receive focus and capture key events when visible
    }

    Image {
        id: photoPreview
    }
}
```

If multiple cameras are available, you can select which one to use by setting the deviceId property to a value from QtMultimedia.availableCameras. On a mobile device, you can conveniently switch between front-facing and back-facing cameras by setting the position property.

如果支持多个相机的话，可以从 `QtMultimedia.availableCameras` 这个列表中挑选某个相机进行使用，通过设置 `deviceId` 即可进行切换。在手机上，一般有前后两个摄像头可以进行切换。

| Property | Description |
|:-----:|:-----------:|
| imageCapture | Methods and properties for capturing still images. |
| videoRecording | Methods and properties for capturing movies. |
| exposure | Methods and properties for adjusting exposure (aperture, shutter speed etc). |
| focus | Methods and properties for adjusting focus and providing feedback on autofocus progress. |
| flash | Methods and properties for controlling the camera flash. |
| imageProcessing | Methods and properties for adjusting camera image processing parameters. |

| 属性 | 描述 |
|:-----:|:-----------:|
| imageCapture | 图像捕获接口 |
| videoRecording | 录像接口 |
| exposure | 曝光设置接口 |
| focus | 聚焦模式接口 |
| flash | 闪光灯设置接口 |
| imageProcessing | 图像处理接口 |

Basic camera state management, error reporting, and simple zoom properties are available in the Camera itself. For integration with C++ code, the mediaObject property allows you to access the standard Qt Multimedia camera controls.

`Camera` 本身会提供一些状态管理，错误报告，简单缩放等操作。在 `c++` 代码中使用 `mediaObject` 属性可以获取更多的操作。

Many of the camera settings may take some time to apply, and might be limited to certain supported values depending on the hardware. Some camera settings may be set manually or automatically. These settings properties contain the current set value. For example, when autofocus is enabled the focus zones are exposed in the `focus` property.

许多的相机设置需要一段时间才能生效，一些设置还会受限与硬件。一些相机设置有自动模式和手动模式。一些设置会使用最近设置的值，例如，当处于自动对焦时就会将 `focus::focusZones` 进行应用。 

For additional information, read also the camera overview.

## 属性文档

> `availability` : `enumeration`

This property holds the availability state of the camera.

相机的可用状态。

The availability states can be one of the following:

| Value | Description |
|:-----:|:-----------:|
|Available | The camera is available to use |
|Busy | The camera is busy at the moment as it is being used by another process. |
|Unavailable | The camera is not available to use (there may be no camera hardware) |
|ResourceMissing | The camera cannot be used because of missing resources. It may be possible to try again at a later time. |

可能是如下值：

| 值 | 描述 |
|:-----:|:-----------:|
|Available | 可用 |
|Busy | 被其他进程使用 |
|Unavailable | 不可用（或许是没有相机模块） |
|ResourceMissing | 因为丢失资源而不可用，可以稍后再试 |

> `cameraState` : `enumeration`

相机的状态。

This property holds the camera object's current state, which can be one of the following:

| Value | Description |
|:-----:|:-----------:|
|UnloadedState | The initial camera state, with the camera not loaded. The camera capabilities (with the exception of supported capture modes) are unknown. This state saves the most power, but takes the longest time to be ready for capture. While the supported settings are unknown in this state, you can still set the camera capture settings like codec, resolution, or frame rate. |
|LoadedState | The camera is loaded and ready to be configured. In the Idle state you can query camera capabilities, set capture resolution, codecs, and so on. The viewfinder is not active in the loaded state. |
|ActiveState | In the active state the viewfinder frames are available and the camera is ready for capture. |

The default camera state is ActiveState.

可能的状态如下：

+ 未加载

+ 已经加载但是未使用

+ 正在使用

默认状态是 `ActiveState`。

> `cameraStatus` : `enumeration`

This property holds the camera object's current status, which can be one of the following:

最近的使用状态：

| Value | Description |
|:-----:|:-----------:|
|ActiveStatus | The camera has been started and can produce data, viewfinder displays video frames. Depending on backend, changing camera settings such as capture mode, codecs, or resolution in ActiveState may lead to changing the status to LoadedStatus and StartingStatus while the settings are applied, and back to ActiveStatus when the camera is ready. |
|StartingStatus | The camera is starting as a result of state transition to Camera.ActiveState. The camera service is not ready to capture yet. |
|StoppingStatus | The camera is stopping as a result of state transition from Camera.ActiveState to Camera.LoadedState or Camera.UnloadedState. |
|StandbyStatus | The camera is in the power saving standby mode. The camera may enter standby mode after some time of inactivity in the Camera.LoadedState state. | 
| LoadedStatus | The camera is loaded and ready to be configured. This status indicates the camera device is opened and it's possible to query for supported image and video capture settings such as resolution, frame rate, and codecs. |
| LoadingStatus | The camera device loading as a result of state transition from Camera.UnloadedState to Camera.LoadedState or Camera.ActiveState. |
| UnloadingStatus | The camera device is unloading as a result of state transition from Camera.LoadedState or Camera.ActiveState to Camera.UnloadedState. |
| UnloadedStatus | The initial camera status, with camera not loaded. The camera capabilities including supported capture settings may be unknown. |
| UnavailableStatus | The camera or camera backend is not available. |

~~这里就不翻译了~~

> `captureMode` : `enumeration`

This property holds the camera capture mode, which can be one of the following:

The default capture mode is `CaptureStillImage`.

相机的捕获状态，有如下值：

默认是 `CaptureStillImage`。

| Value | Description |
|:-----:|:-----------:|
|CaptureViewfinder | Camera is only configured to display viewfinder. |
|CaptureStillImage | Prepares the Camera for capturing still images. |
|CaptureVideo | Prepares the Camera for capturing video. |

> `deviceId` : `string`

This property holds the unique identifier for the camera device being used. It may not be human-readable.

指明了相机的唯一标识符，或许人类不可读（纳尼！）。

You can get all available device IDs from `QtMultimedia.availableCameras`. If no value is provided or if set to an empty string, the system's default camera will be used.

你可以从 `QtMultimedia.availableCameras` 列表中获取设备号。如果是空串，就会使用系统默认的相机设备。

If possible, `cameraState`, `captureMode`, `digitalZoom` and other camera parameters are preserved when changing the camera device.

如果可以，当使用其他相机设备时，`cameraState`，`captureMode`，`digitalZoom` 以及其他参数会更新。

This QML property was introduced in QtMultimedia 5.4.

See also `displayName` and `position`.

> `digitalZoom` : `real`

This property holds the current digital zoom factor.

数字变焦，或者说数字缩放。

> `displayName` : `string` read-only

This property holds the human-readable name of the camera.

这个值是相机的名称，人类不可读（纳尼！）。

You can use this property to display the name of the camera in a user interface.

你可以使用这个值在用户界面中显示。

This QML property was introduced in QtMultimedia 5.4.

See also `deviceId`.

> `errorCode` : `enumeration`

This property holds the last error code.

错误码。

See also `error` and `errorString`.

> `errorString` : `string`

This property holds the last error string, if any.

错误描述。

See also `error` and `errorCode`.

> `lockStatus` : `enumeration`

This property holds the status of all the requested camera locks.

相机的锁定状态。例如一些自动挡的设置，会自动寻找最佳的配置，当找到最佳配置后就锁定。使用 `searchAndLock()` 来寻找最佳配置并且锁定最佳配置。

The status can be one of the following values:

| Value | Description |
|:-----:|:-----------:|
|Unlocked | The application is not interested in camera settings value. The camera may keep this parameter without changes, which is common with camera focus, or adjust exposure and white balance constantly to keep the viewfinder image nice. |
|Searching | The application has requested the camera focus, exposure, or white balance lock with searchAndLock(). This state indicates the camera is focusing or calculating exposure and white balance. |
|Locked | The camera focus, exposure, or white balance is locked. The camera is ready to capture, and the application may check the exposure parameters. The locked state usually means the requested parameter stays the same, except in cases where the parameter is requested to be updated constantly. For example in continuous focusing mode, the focus is considered locked as long as the object is in focus, even while the actual focusing distance may be constantly changing. |

> `maximumDigitalZoom` : `real`

This property holds the maximum digital zoom factor supported, or 1.0 if digital zoom is not supported.

最大数字变焦。如果为 `1.0` ，就不支持数字变焦（数字缩放）。

> `maximumOpticalZoom` : `real`

This property holds the maximum optical zoom factor supported, or 1.0 if optical zoom is not supported.

最大光线变焦，如果为 `1.0`，就不支持光学变焦。

> `mediaObject` : `variant`

This property holds the native media object for the camera.

这个属性保存的是 `Camera` 的媒体对象 `QCamera`。

It can be used to get a pointer to a QCamera object in order to integrate with C++ code.

在 `C++` 代码中可访问 `QCamera`。

```
QObject *qmlCamera; // The QML Camera object
QCamera *camera = qvariant_cast<QCamera *>(qmlCamera->property("mediaObject"));
```

Note: This property is not accessible from QML.

> 注意：不可直接在 QML 中使用此属性。

> `metaData` : `group`

| metaData group |
|:-----:|
| metaData.cameraManufacturer : variant |
| metaData.cameraModel : variant |
| metaData.event : variant |
| metaData.subject : variant |
| metaData.orientation : variant |
| metaData.dateTimeOriginal : variant |
| metaData.gpsLatitude : variant |
| metaData.gpsLongitude : variant |
| metaData.gpsAltitude : variant |
| metaData.gpsTimestamp : variant |
| metaData.gpsTrack : variant |
| metaData.gpsSpeed : variant |
| metaData.gpsImgDirection : variant |
| metaData.gpsProcessingMethod : variant |

These properties hold the meta data for the camera captures.

+ `metaData.cameraManufacturer` holds the name of the manufacturer of the camera.

+ `metaData.cameraModel` holds the name of the model of the camera.

+ `metaData.event` holds the event during which the photo or video is to be captured.

+ `metaData.subject` holds the name of the subject of the capture or recording.

+ `metaData.orientation` holds the clockwise rotation of the camera at time of capture.

+ `metaData.dateTimeOriginal` holds the initial time at which the photo or video is captured.

+ `metaData.gpsLatitude` holds the latitude of the camera in decimal degrees at time of capture.

+ `metaData.gpsLongitude` holds the longitude of the camera in decimal degrees at time of capture.

+ `metaData.gpsAltitude` holds the altitude of the camera in meters at time of capture.

+ `metaData.gpsTimestamp` holds the timestamp of the GPS position data.

+ `metaData.gpsTrack` holds direction of movement of the camera at the time of capture. It is measured in degrees clockwise from north.

+ `metaData.gpsSpeed` holds the velocity in kilometers per hour of the camera at time of capture.

+ `metaData.gpsImgDirection` holds direction the camera is facing at the time of capture. It is measured in degrees clockwise from north.

+ `metaData.gpsProcessingMethod` holds the name of the method for determining the GPS position.

This property group was introduced in Qt 5.4.

See also `QMediaMetaData`.

~~上述就不翻译了。~~

> `opticalZoom` : `real`

This property holds the current optical zoom factor.

设置光学变焦。

> `orientation` : `int` read-only

This property holds the physical orientation of the camera sensor.

相机的物理方向。

The value is the orientation angle (clockwise, in steps of 90 degrees) of the camera sensor in relation to the display in its natural orientation.

这个值保存的是一个角度值（顺时针）。

For example, suppose a mobile device which is naturally in portrait orientation. The back-facing camera is mounted in landscape. If the top side of the camera sensor is aligned with the right edge of the screen in natural orientation, orientation returns 270. If the top side of a front-facing camera sensor is aligned with the right edge of the screen, orientation returns 90.

例如，手机的默认方向是竖屏。后置摄像头一般是横屏。如果相机的顶边与屏幕的右边贴合，则 `orientation` 的值为 270 度。如果前置相机的顶部与屏幕的右边贴合，则 `orientation` 为 90 度。

This QML property was introduced in QtMultimedia 5.4.

See also `VideoOutput::orientation`.

> `position` : `enumeration`

This property holds the physical position of the camera on the hardware system.

标明了相机相对硬件系统的位置。

The position can be one of the following:

可能值如下：

| Value | Description |
|:-----:|:-----------:|
| Camera.UnspecifiedPosition | the camera position is unspecified or unknown. |
| Camera.BackFace | the camera is on the back face of the system hardware. For example on a mobile device, it means it is on the opposite side to that of the screem. |
| Camera.FrontFace | the camera is on the front face of the system hardware. For example on a mobile device, it means it is on the same side as that of the screen. Viewfinder frames of front-facing cameras are mirrored horizontally, so the users can see themselves as looking into a mirror. Captured images or videos are not mirrored. On a mobile device it can be used to easily choose between front-facing and back-facing cameras. If this property is set to Camera.UnspecifiedPosition, the system's default camera will be used. |

If possible, cameraState, captureMode, digitalZoom and other camera parameters are preserved when changing the camera device.

如果可以，当使用其他相机设备时，`cameraState`，`captureMode`，`digitalZoom` 以及其他参数会更新。

This QML property was introduced in QtMultimedia 5.4.

> `viewfinder` : `group`

| viewfinder group |
|:-----:|
| viewfinder.resolution : size |
| viewfinder.minimumFrameRate : real |
| viewfinder.maximumFrameRate : real |

These properties hold the viewfinder settings.

一些预览视图的设置，例如尺寸，最高刷新帧率和最顶刷新帧率等。

+ `viewfinder.resolution` holds the resolution of the camera viewfinder. If no resolution is given or if it is empty, the backend uses a default value.

+ `viewfinder.minimumFrameRate` holds the minimum frame rate for the `viewfinder` in frames per second. If no value is given or if set to 0, the backend uses a default value.

+ `viewfinder.maximumFrameRate` holds the maximum frame rate for the `viewfinder` in frames per second. If no value is given or if set to 0, the backend uses a default value.

If `viewfinder.minimumFrameRate` is equal to `viewfinder.maximumFrameRate`, the frame rate is fixed. If not, the actual frame rate fluctuates between the two values.

如果 `viewfinder.minimumFrameRate` 等于 `viewfinder.maximumFrameRate`，实际帧率就会自动修复到最佳。如果不相等，实际帧率在这两者之间。

Changing the viewfinder settings while the camera is in the `Camera.ActiveState` state may cause the camera to be restarted.

在相机处于 `Camera.ActiveState` 状态时，设置 `viewfinder` 会使相机重新启动（不是重启哦~）。

If the camera is used to capture videos or images, the viewfinder settings might be ignored if they conflict with the capture settings. You can check the actual viewfinder settings once the camera is in the Camera.ActiveStatus status.

~~不知道在说什么，大体就是在拍照和录像的时候，`viewfinder` 的设置会被忽略吧。~~

Supported values can be retrieved with `supportedViewfinderResolutions()` and `supportedViewfinderFrameRateRanges()`.

`supportedViewfinderResolutions()` 和 `supportedViewfinderFrameRateRanges()` 可以用来设置 `viewfinder` 对应的属性。

This property group was introduced in Qt 5.4.

## 属性文档

> `cameraStateChanged(state)`

This signal is emitted when the camera state has changed to state. Since the state changes may take some time to occur this signal may arrive sometime after the state change has been requested.

在设置相机状态时触发。

The corresponding handler is onCameraStateChanged.

> `digitalZoomChanged(zoom)`

This signal is emitted when the digital zoom setting has changed to zoom.

在设置数字变焦时触发。

The corresponding handler is onDigitalZoomChanged.

> `error(errorCode, errorString)`

This signal is emitted when an error occurs. The enumeration value errorCode is one of the values defined below, and a descriptive string value is available in errorString.

相机出错时会触发，错误号如下：

| Value | Description |
|:-----:|:-----------:|
|NoError | No errors have occurred. |
|CameraError | An error has occurred. |
|InvalidRequestError | System resource doesn't support requested functionality. |
|ServiceMissingError | No camera service available. |
|NotSupportedFeatureError | The feature is not supported. |

The corresponding handler is onError.

See also `errorCode` and `errorString`.

> `lockStatusChanged()`

This signal is emitted when the lock status (focus, exposure etc) changes. This can happen when locking (e.g. autofocusing) is complete or has failed.

一些设置的锁定状态改变时触发。一般发生在锁定完成或者失败。

The corresponding handler is onLockStatusChanged.

> `manualWhiteBalanceChanged(qreal)`

This signal is emitted when the manualWhiteBalance property is changed.

设置 `manualWhiteBalance` 时触发。

The corresponding handler is onManualWhiteBalanceChanged.

> `maximumDigitalZoomChanged(zoom)`

This signal is emitted when the maximum digital zoom setting has changed to zoom. This can occur when you change between video and still image capture modes, or the capture settings are changed.

设置 `maximumDigitalZoom` 时触发。

The corresponding handler is onMaximumDigitalZoomChanged.

> `maximumOpticalZoomChanged(zoom)`

This signal is emitted when the maximum optical zoom setting has changed to zoom. This can occur when you change between video and still image capture modes, or the capture settings are changed.

设置 `maximumOpticalZoom` 时触发。

The corresponding handler is onMaximumOpticalZoomChanged.

> `opticalZoomChanged(zoom)`

This signal is emitted when the optical zoom setting has changed to zoom.

设置 `opticalZoom` 时触发。

The corresponding handler is onOpticalZoomChanged.

> `whiteBalanceModeChanged(Camera::WhiteBalanceMode)`

This signal is emitted when the whiteBalanceMode property is changed.

设置 `whiteBalanceMode` 时触发。

The corresponding handler is onWhiteBalanceModeChanged.

## 方法文档

> `searchAndLock()`

Start focusing, exposure and white balance calculation.

开始计算最佳的焦点，白平衡等配置。

This is appropriate to call when the camera focus button is pressed (or on a camera capture button half-press). If the camera supports autofocusing, information on the focus zones is available through the `focus` property.

> `start()`

Starts the camera. Viewfinder frames will be available and image or movie capture will be possible.

启动相机，开始拍照或者录像以及预览。

> `stop()`

Stops the camera, but leaves the camera stack loaded.

停止相机。

> `list<object> supportedViewfinderFrameRateRanges(size resolution = undefined)`

Returns a list of supported viewfinder frame rate ranges.

返回支持的帧率列表。

Each range object in the list has the minimumFrameRate and maximumFrameRate properties.

遍历这个列表的每个对象，可以访问 `minimumFrameRate` 和 `maximumFrameRate` 属性。

If the optional parameter resolution is specified, the returned list is reduced to frame rate ranges supported for the given resolution.

The camera must be loaded before calling this function, otherwise the returned list is empty.

This QML method was introduced in Qt 5.5.

See also `viewfinder`.

> `list<size> supportedViewfinderResolutions(real minimumFrameRate = undefined, real maximumFrameRate = undefined)`

返回支持的预览尺寸。

If both optional parameters minimumFrameRate and maximumFrameRate are specified, the returned list is reduced to resolutions supported for the given frame rate range.

The camera must be loaded before calling this function, otherwise the returned list is empty.

This QML method was introduced in Qt 5.5.

See also `viewfinder`.

> `unlock()`

Unlock focus, exposure and white balance locks.

解除某些设置的锁定。
