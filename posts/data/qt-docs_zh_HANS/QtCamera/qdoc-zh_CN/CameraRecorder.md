# QtMultiMedia 之 CameraRecorder

> 翻译： qyvlik

> 5.5.1

为 `Camera` 提供视频录制控制。

## 属性

+ `actualLocation`    : `string`

+ `audioBitRate`      : `int`

+ `audioChannels`     : `int`

+ `audioCodec`        : `string`

+ `audioEncodingMode` : `enumeration`

+ `audioSampleRate`   : `int`

+ `duration`          : `int`

+ `errorCode`         : `enumeration`

+ `errorString`       : `string`

+ `frameRate`         : `qreal`

+ `mediaContainer`    : `string`

+ `muted`             : `bool`

+ `outputLocation`    : `string`

+ `recorderState`     : `enumeration`

+ `recorderStatus`    : `enumeration`

+ `resolution`        : `size`

+ `videoBitRate`      : `int`

+ `videoCodec`        : `string`

+ `videoEncodingMode` : `enumeration`

## 方法

+ `record()`

+ `setMetadata(key, value)`

+ `stop()`

## 详细描述

CameraRecorder allows recording camera streams to files, and adjusting recording settings and metadata for videos.

It should not be constructed separately, instead the videoRecorder property of a Camera should be used.

`CameraRecorder` 允许录制视频流到文件，为视频调整设置和元信息（例如 gps 等信息）。

`CameraRecorder` 不能直接创建，只能通过某个实例化的 `Camera` 的 `videoRecorder` 属性来使用。

```
Camera {
    videoRecorder.audioEncodingMode: CameraRecorder.ConstantBitrateEncoding;
    videoRecorder.audioBitRate: 128000
    videoRecorder.mediaContainer: "mp4"
    // ...
}
```

There are many different settings for each part of the recording process (audio, video, and output formats), as well as control over muting and where to store the output file.

录制过程中有许多设置，例如音频，视频，输出格式等，也允许控制是否静音以及存储路径等。

## 属性文档

> `actualLocation`    : `string`

This property holds the actual location of the last saved media content. The actual location is usually available after the recording starts, and reset when new location is set or the new recording starts.

这个属性保存的是最后保存的媒体内容的本地路径。通常在录制开始后这个本地路径才有效，当开始新的录制时，这个本地路径就会更新。

> `audioBitRate`      : `int`

This property holds the audio bit rate (in bits per second) to be used for recording video.

这个属性设置了录制视频时音频的比特率。

> `audioChannels`     : `int`

This property indicates the number of audio channels to be encoded while recording video (1 is mono, 2 is stereo).

在录制视频时，这个属性表示音频的通道数。（1 是 单声道，2 是立体声）。

~~不过原文中单声道是 momo，momo 是什么鬼~~

> `audioCodec`        : `string`

This property holds the audio codec to be used for recording video. Typically this is aac or amr-wb.

录制视频时指定的音频格式，一般是 `aac` 或者 `amr-wb`。

> `audioEncodingMode` : `enumeration`

The type of encoding method to use when recording audio.

录制音频的编码模式。

| Value | Description |
|:-----:|:-----------:|
| ConstantQualityEncoding | Encoding will aim to have a constant quality, adjusting bitrate to fit. This is the default. The bitrate setting will be ignored. |
| ConstantBitRateEncoding | Encoding will use a constant bit rate, adjust quality to fit. This is appropriate if you are trying to optimize for space. |
| AverageBitRateEncoding | Encoding will try to keep an average bitrate setting, but will use more or less as needed. |

| 值 | 描述 |
|:-----:|:-----------:|
| ConstantQualityEncoding | 编码时将有一个固定的质量，自动调整比特率。这个是默认值，~~自行设置比特率的将会被忽略。~~ |
| ConstantBitRateEncoding | 编码时将有一个固定的比特率，自行设置质量值来调整。你可以适当的调整质量值来优化存储。 |
| AverageBitRateEncoding | 编码时将会试图保存一个平均比特率，一般很少使用。 |

> `audioSampleRate`   : `int`

This property holds the sample rate to be used to encode audio while recording video.

录制视频时用来编码音频的采样率。

> `duration`          : `int`

This property holds the duration (in miliseconds) of the last recording.

最近一次录制的时长（毫秒）。

> `errorCode`         : `enumeration`

This property holds the last error code.

| Value | Description |
|:-----:|:-----------:|
| NoError | No Errors |
| ResourceError | Device is not ready or not available. |
| FormatError | Current format is not supported. |
| OutOfSpaceError | No space left on device. |

| 值 | 描述 |
|:-----:|:-----------:|
| NoError | 没有错误 |
| ResourceError | 设备还未就绪或者无法使用。 |
| FormatError | 不支持当前格式。 |
| OutOfSpaceError | 没有足够的存储空间。 |

> `errorString`       : `string`

This property holds the description of the last error.

保存最后一次错误描述。

> `frameRate`         : `qreal`

This property holds the framerate (in frames per second) to be used for recording video.

录制视频的帧率。

> `mediaContainer`    : `string`

This property holds the media container to be used for recording video. Typically this is mp4.

媒体容器，其实就是后缀名。默认为 `mp4`。

> `muted`             : `bool`

This property indicates whether the audio input is muted during recording.

> `outputLocation`    : `string`

This property holds the destination location of the media content. If the location is empty, the recorder uses the system-specific place and file naming scheme.

媒体内容的终点路径（其实是保存路径？）。如果这个路径是空的，将会使用系统指定的路径和文件命名方式。

> `recorderState`     : `enumeration`

This property holds the current state of the camera recorder object.

相机的录制状态。

The state can be one of these two:

| Value | Description |
|:-----:|:-----------:|
| StoppedState | The camera is not recording video. |
| RecordingState | The camera is recording video. |

一般有两个状态：

| Value | Description |
|:-----:|:-----------:|
| StoppedState | 没有录制。 |
| RecordingState | 正在录制。 |

> `recorderStatus`    : `enumeration`

This property holds the current status of media recording.

录制媒体的状态。

| Value | Description |
|:-----:|:-----------:|
| UnavailableStatus | Recording is not supported by the camera. |
| UnloadedStatus | The recorder is available but not loaded. |
| LoadingStatus | The recorder is initializing. |
| LoadedStatus | The recorder is initialized and ready to record media. |
| StartingStatus | Recording is requested but not active yet. |
| RecordingStatus | Recording is active. |
| PausedStatus | Recording is paused. |
| FinalizingStatus | Recording is stopped with media being finalized. |

| Value | Description |
|:-----:|:-----------:|
| UnavailableStatus | 相机不支持录制。 |
| UnloadedStatus | 相机支持录制，但是未加载。 |
| LoadingStatus | 相机录制器正在初始化 |
| LoadedStatus | 相机录制器完成初始化，可以开始录制。 |
| StartingStatus | 相机录制器请求录制，等待响应中。 |
| RecordingStatus | 相机录制器正在录制。 |
| PausedStatus | 相机录制器暂停录制。 |
| FinalizingStatus | 相机录制器停止录制。 |

> `resolution`        : `size`

This property holds the video frame dimensions to be used for video capture.

保存了视频帧的大小尺寸。

> `videoBitRate`      : `int`

This property holds the bit rate (in bits per second) to be used for recording video.

视频的比特率。

> `videoCodec`        : `string`

This property holds the video codec to be used for recording video. Typically this is h264.

视频的编码方式，默认 `h264`。

> `videoEncodingMode` : `enumeration`

This property holds the type of encoding method to be used for recording video.

录制视频的编码模式。

The following are the different encoding methods used:

| Value | Description |
|:-----:|:-----------:|
| ConstantQualityEncoding | Encoding will aim to have a constant quality, adjusting bitrate to fit. This is the default. The bitrate setting will be ignored. |
| ConstantBitRateEncoding | Encoding will use a constant bit rate, adjust quality to fit. This is appropriate if you are trying to optimize for space. |
| AverageBitRateEncoding | Encoding will try to keep an average bitrate setting, but will use more or less as needed. |

有如下不同的模式可以使用：

| 值 | 描述 |
|:-----:|:-----------:|
| ConstantQualityEncoding | 编码时将有一个固定的质量，自动调整比特率。这个是默认值，~~自行设置比特率的将会被忽略。~~ |
| ConstantBitRateEncoding | 编码时将有一个固定的比特率，自行设置质量值来调整。你可以适当的调整质量值来优化存储。 |
| AverageBitRateEncoding | 编码时将会试图保存一个平均比特率，一般很少使用。 |

## 方法文档

> `record()`

Starts recording.

开始录制。

> `setMetadata(key, value)`

Sets metadata for the next video to be recorder, with the given key being associated with value.

为下一个视频设置元数据。

> `stop()`

Stops recording.

停止录制。
