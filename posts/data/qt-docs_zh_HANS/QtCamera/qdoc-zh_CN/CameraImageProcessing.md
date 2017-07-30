# QtMultiMedia 之 CameraImageProcessing

> 翻译：qyvlik

> 5.5.1

用来调整与捕获照片相关的设置。

## 属性文档

+ `colorFilter`           : `enumeration`

+ `contrast`              : `qreal`

+ `denoisingLevel`        : `qreal`

+ `manualWhiteBalance`    : `qreal`

+ `saturation`            : `qreal`

+ `sharpeningLevel`       : `qreal`

+ `whiteBalanceMode`      : `enumeration`

## 详细描述

`CameraImageProcessing` provides control over post-processing done by the camera middleware, including white balance adjustments, contrast, saturation, sharpening, and denoising

`CameraImageProcessing`提供了一些图像处理，包括白平衡，对比度，饱和度，锐化，降噪。

It should not be constructed separately, instead the imageProcessing property of a Camera should be used.

不可创建，只能通过 `Camera::imageProcessing` 访问。

```
Camera {
    id: camera

    imageProcessing {
        whiteBalanceMode: Camera.WhiteBalanceTungsten
        contrast: 0.66
        saturation: -0.5
    }
}
```

## 属性文档

`colorFilter`           : `enumeration`

This property holds which color filter if any will be applied to image data captured by the camera.

颜色过滤。

| Value | Description |
|:-----:|:-----------:|
|CameraImageProcessing.ColorFilterNone | No filter is applied to images. |
|CameraImageProcessing.ColorFilterGrayscale | A grayscale filter. |
|CameraImageProcessing.ColorFilterNegative | A negative filter. |
|CameraImageProcessing.ColorFilterSolarize | A solarize filter. |
|CameraImageProcessing.ColorFilterSepia | A sepia filter. |
|CameraImageProcessing.ColorFilterPosterize | A posterize filter. |
|CameraImageProcessing.ColorFilterWhiteboard | A whiteboard filter. |
|CameraImageProcessing.ColorFilterBlackboard | A blackboard filter. |
|CameraImageProcessing.ColorFilterAqua | An aqua filter. |
|CameraImageProcessing.ColorFilterVendor | The base value for vendor defined filters. |

> `contrast`              : `qreal`

Image contrast adjustment. Valid contrast adjustment values range between -1.0 and 1.0, with a default of 0.

图像对比度。有效值是 `-1.0` 到 `1.0`，默认值是 `0`。

> `denoisingLevel`        : `qreal`

Adjustment of denoising applied to image.

Valid denoising level values range between -1.0 for for denoising disabled, 0 for default denoising level and 1.0 for maximum denoising applied.

设置降噪级数。

有效值从 `-1.0` 到 `1.0`，默认值为 `0`。 `1.0` 为最大降噪级数。

> `manualWhiteBalance`    : `qreal`

The color temperature used when in manual white balance mode (WhiteBalanceManual). The units are Kelvin.

手动白平衡，在 `whiteBalanceMode` 设置为 `WhiteBalanceManual` 模式后才可设置。单位为 `Kelvin`。

> `saturation`            : `qreal`

Image saturation adjustment. Valid saturation adjustment values range between -1.0 and 1.0, the default is 0.

图像保护度。 有效值为 `-1.0` 到 `1.0`，默认值为 `0`。

> `sharpeningLevel`       : `qreal`

Adjustment of sharpening level applied to image.

Valid sharpening level values range between -1.0 for for sharpening disabled, 0 for default sharpening level and 1.0 for maximum sharpening applied.

图像锐化级数。

有效值为 `-1.0` 到 `1.0`，默认是为 `0`，锐化级数最大为 `1.0`。

> `whiteBalanceMode`      : `enumeration`

| Value | Description |
|:-----:|:-----------:|
| WhiteBalanceManual | Manual white balance. In this mode the manual white balance property value is used. |
| WhiteBalanceAuto | Auto white balance mode. | 
| WhiteBalanceSunlight | Sunlight white balance mode. |
| WhiteBalanceCloudy | Cloudy white balance mode. |
| WhiteBalanceShade | Shade white balance mode. |
| WhiteBalanceTungsten | Tungsten white balance mode. |
| WhiteBalanceFluorescent | Fluorescent white balance mode. |
| WhiteBalanceFlash | Flash white balance mode. |
| WhiteBalanceSunset | Sunset white balance mode. |
| WhiteBalanceVendor | Vendor defined white balance mode. |
