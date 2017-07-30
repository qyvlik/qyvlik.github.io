# QML 轴线

> 翻译 [qyvlik](http://blog.qyvlik.space)

> Axes：轴线，series：连续的，串联的，scatter：离散的

```qml

  ChartView {
      title: "Two Series, Common Axes"
      anchors.fill: parent
      legend.visible: false
      antialiasing: true

      ValueAxis {
          id: axisX
          min: 0
          max: 10
          tickCount: 5
      }

      ValueAxis {
          id: axisY
          min: -0.5
          max: 1.5
      }

      LineSeries {
          id: series1
          axisX: axisX
          axisY: axisY
      }

      ScatterSeries {
          id: series2
          axisX: axisX
          axisY: axisY
      }
  }

  // Add data dynamically to the series
  Component.onCompleted: {
      for (var i = 0; i <= 10; i++) {
          series1.append(i, Math.random());
          series2.append(i, Math.random());
      }
  }
```