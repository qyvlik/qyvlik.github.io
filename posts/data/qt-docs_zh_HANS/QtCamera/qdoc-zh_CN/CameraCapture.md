# QtMultiMedia 之 CameraCapture

> 翻译 [qyvlik](http://blog.qyvlik.space)

> 5.5.1

## 属性

+ `capturedImagePath` : `string`

+ `errorString`       : `string`

+ `ready`             : `bool`

+ `resolution`        : `size`

## 信号

+ `captureFailed(requestId, message)`

+ `imageCaptured(requestId, preview)`

+ `imageMetadataAvailable(requestId, key, value)`

+ `imageSaved(requestId, path)`

## 方法

+ `cancelCapture()`

+ `capture()`
 
+ `captureToLocation(location)`

+ `setMetadata(key, value)`

## 详细描述

This type allows you to capture still images and be notified when they are available or saved to disk. You can adjust the resolution of the captured image and where the saved image should go.

这个类允许你在合适的时刻捕获图片。你可以调整捕获图片的尺寸以及图片保存的路径。

CameraCapture is a child of a Camera (as the imageCapture property) and cannot be created directly.

`CameraCapture` 作为 `Camera` 的一个孩子，只能通过 `Camera` 的 `imageCapture` 属性访问，不能直接创建。

```
Item {
    width: 640
    height: 360

    Camera {
        id: camera

        imageCapture {
            onImageCaptured: {
                // Show the preview in an Image
                photoPreview.source = preview
            }
        }
    }

    VideoOutput {
        source: camera
        focus : visible // to receive focus and capture key events when visible
        anchors.fill: parent

        MouseArea {
            anchors.fill: parent;
            onClicked: camera.imageCapture.capture();
        }
    }

    Image {
        id: photoPreview
    }
}
```

## 属性文档

> `capturedImagePath` : `string`

This property holds the location of the last captured image.

这个属性保存的是最后一次捕获图片的路径。

> `errorString`       : `string`

This property holds the error message related to the last capture.

这个属性保存的是最后一次捕获图片的错误信息。

> `ready`             : `bool`

This property holds a bool value indicating whether the camera is ready to capture photos or not.

Calling capture() while ready is false is not permitted and results in an error.

`ready` 表明了捕获照片是否就绪。在未就绪就调用 `capture()` 是不允许的，并且会返回一个错误。

> `resolution`        : `size`

This property holds the resolution/size of the image to be captured. If empty, the system chooses the appropriate resolution.

这个属性是捕获的照片的尺寸，如果为空，则会使用系统默认的尺寸。

## 信号文档

> `captureFailed(requestId, message)`

This signal is emitted when an error occurs during capture with requestId. A descriptive message is available in message.

The corresponding handler is onCaptureFailed.

在捕获照片出错时触发。返回一个 `requestId` 和错误的描述信息。

> `imageCaptured(requestId, preview)`

This signal is emitted when an image with requestId has been captured but not yet saved to the filesystem. The preview parameter can be used as the URL supplied to an Image.

The corresponding handler is onImageCaptured.

在捕获照片成功后，但还未保存到文件系统时触发。`perview` 参数可以设置到 `Image::source` 用来预览。

> `imageMetadataAvailable(requestId, key, value)`

This signal is emitted when the image with requestId has new metadata available with the key key and value value.

The corresponding handler is onImageMetadataAvailable.

See also imageCaptured.

在捕获照片写入元数据后触发。

> `imageSaved(requestId, path)`

This signal is emitted after the image with requestId has been written to the filesystem. The path is a local file path, not a URL.

The corresponding handler is onImageSaved.

在将捕获照片写入文件系统后触发，`path` 为本地文件路径，不是 `URL`。

## 方法文档

> `cancelCapture()`

Cancel pending image capture requests.

> `capture()`

Start image capture. The imageCaptured and imageSaved signals will be emitted when the capture is complete.

The image will be captured to the default system location, typically QStandardPaths::writableLocation(QStandardPaths::PicturesLocation) for still imaged or QStandardPaths::writableLocation(QStandardPaths::MoviesLocation) for video.

Camera saves all the capture parameters like exposure settings or image processing parameters, so changes to camera parameters after capture() is called do not affect previous capture requests.

capture() returns the capture requestId parameter, used with imageExposed(), imageCaptured(), imageMetadataAvailable() and imageSaved() signals.

See also ready.

开始捕获图片。在捕获完成后，`imageCaptured` 和 `imageSaved` 就会触发。

捕获的图片或保存到默认的系统路径，图片保存在 `QStandardPaths::writableLocation`（`QStandardPaths::PicturesLocation`），视频保存在 `QStandardPaths::writableLocation`（`QStandardPaths::MoviesLocation`）。

`Camera` 会保存所有的捕获参数例如曝光设置或者图片处理参数，所以在 `capture()` 使用后再设置这些参数，对已经捕获的照片是无效的，但是对下一次捕获是有效的。

`capture()` 会返回一个 `requestId` 参数，在 `imageExposed()`，`imageCaptured()`，`imageMetadataAvailable()`，`imageSaved()` 这些信号中使用。

> `captureToLocation(location)`

Start image capture to specified location. The imageCaptured and imageSaved signals will be emitted when the capture is complete.

CameraCapture::captureToLocation returns the capture requestId parameter, used with imageExposed(), imageCaptured(), imageMetadataAvailable() and imageSaved() signals.

If the application is unable to write to the location specified by location the CameraCapture will emit an error. The most likely reasons for the application to be unable to write to a location is that the path is wrong and the location does not exists, or the application does not have write permission for that location.

开始将图片捕获到指定空间。当捕获完成后会触发 `imageCaptured` 和 `imageSaved` 信号。

`CameraCapture::captureToLocation` 会返回一个 `requestId` 参数，在 `imageExposed()`，`imageCaptured()`，`imageMetadataAvailable()`，`imageSaved()` 这些信号中使用。

如果应用无法将图片写入指定空间，`CameraCapture` 将会触发一个错误信息。大多数错误信息是路径错误或者路径不存在，或者应用没有权限操作指定路径。


> `setMetadata(key, value)`

Sets a particular metadata key to value for the subsequent image captures.

See also `QMediaMetaData`.

设置图片的元数据。
