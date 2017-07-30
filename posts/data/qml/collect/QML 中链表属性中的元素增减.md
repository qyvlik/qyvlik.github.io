# QML 中链表属性的元素增减

> 作者 [qyvlik](http://blog.qyvlik.space)

有如下代码：

```
//~ List
Item {
    property list<QtObject> lists
}

//~ main
List {
    lists: [
        QtObject {},
        QtObject {}
    ]
}
```

执行后，就会自动将 `QtObject` 加入到 `lists`。但是完成初始化后，就无法直接向 `lists` 中添加或者移除某个特定的元素。

这里提供一些解决方法。

```
// 不要插入越界
// index: [0, qmllistproperty.length]
function qmlListPropertyInsert(qmllistproperty, index, item) {
    if(index > qmllistproperty.length) return qmllistproperty;
    var  qmllistproperty_ = [];
    var length = qmllistproperty.length + 1;
    
    var flag = false;           // insert ?
    for(var iter = 0; iter < length; iter++) {
        if(iter === index) {
             qmllistproperty_.push(item);
            flag = true;
        } else {
            if(flag) {
                 qmllistproperty_.push(qmllistproperty[iter-1]);
            } else {
                 qmllistproperty_.push(qmllistproperty[iter]);
            }
        }
    }
    return qmllistproperty_; 
}

function qmlListPropertyRemove(qmllistproperty, index) {
    if(index > qmllistproperty.length-1) return qmllistproperty;
    var  qmllistproperty_ = [];
    for(var iter in qmllistproperty) {
        if(iter === index) {
            continue;
        } else {
             qmllistproperty_.push(qmllistproperty[iter]);
        }
    }
    return qmllistproperty_;
}
```

