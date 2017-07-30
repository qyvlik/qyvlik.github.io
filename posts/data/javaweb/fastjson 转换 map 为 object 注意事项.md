# fastjson 转换 map 为 object 注意事项

> 作者 [qyvlik](http://blog.qyvlik.space)

将 Http 的 `ParameterMap` 转换为对应 `JSON` 对象时，要注意 **由于表单提交的键，会有多个对应值，取第一个即可**

```
public static Map<String, Object> convertParameterMap(Map<String, Object> paramsMap) {
    Map<String, Object> treeMap = new TreeMap<String, Object>();

    for (String key : paramsMap.keySet()) {
        Object[] values = (Object[]) paramsMap.get(key);
        if (values != null && values.length != 0) {
            treeMap.put(key, values[0]);
        }
    }

    return treeMap;
}

public static <T> T fromParamsMap(Map<String, Object> paramsMap, Class<T> clazz) {
    String jsonStr = JSON.toJSONString(convertParameterMap(paramsMap));
    T t = JSON.parseObject(jsonStr, clazz);
    return t;
}
```