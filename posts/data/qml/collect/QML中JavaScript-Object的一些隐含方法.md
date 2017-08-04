# QML中JavaScript-Object的一些隐含方法

> 作者 [qyvlik](http://blog.qyvlik.space)

其实不能说是隐含，是比较少用到。

## 为对象设置 `get/set` 

```
var O = function() {
    this._x = 1000;
    this.__defineSetter__('x', function(value) {
        console.log("this is __defineSetter__ 'x' ")
        this._x = value;
    });

    this.__defineGetter__('x', function(){
        return this._x;
    });
}


var o = new O;
o.x = 10;
console.log(o.x);
```

打印如下：

```
qml: this is __defineSetter__ 'x' 
qml: 10
```

跟 `Q_PROPERTY` 类似，通过指定特定函数为 `get/set` 来实现属性。

```
var O = function() {
    this._x = 1000;
    this.__defineSetter__('x', function(value) {
        throw "x is readonly property";
    });

    this.__defineGetter__('x', function(){
        return this._x;
    });
}

var o = new O;
console.log(o.x);
o.x = 10;
console.log(o.x);
```

如上代码可以设置属性为只读，在试图写属性时，抛异常。

可以实现类似的信号与槽机制。

```
function O() {
    this._x = 1000;
    this._onChangeCallbackList = [];

    this.__defineSetter__('x', function(value) {
        console.log("this is __defineSetter__ 'x' ")
        if(this._x !== value) {
            this._x = value;
            this.__callValueChangeCallback('x');
        }
    });

    this.__defineGetter__('x', function(){
        return this._x;
    });
}

O.prototype = {

    onChanged : function(propertyName, callback) {
        var index = -1;
        for(var iter in this._onChangeCallbackList) {
            if(this._onChangeCallbackList[iter].property === propertyName) {
                index = iter;
                break;
            }
        }
        if(index != -1) {
            this._onChangeCallbackList[index].callback = callback;
        } else {
            this._onChangeCallbackList.push({
                                                'property': propertyName,
                                                'callback': callback
                                            });
        }
    },

    __callValueChangeCallback : function(propertyName) {
        var index = -1;
        for(var iter in this._onChangeCallbackList) {
            if(this._onChangeCallbackList[iter].property === propertyName) {
                this._onChangeCallbackList[iter].callback();
                break;
            }
        }
    }
};


var o = new O;
o.onChanged('x', function(){
    console.log("x changed!")
});
o.x = 10;
console.log(o.x);
```