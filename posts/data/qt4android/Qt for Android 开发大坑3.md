# Qt for Android �������3

## ������̨�лؽ���

qt for android��app����home�Ƶ���̨����һ��ʱ����resume���м��ʱ�� freezing ״̬����Ļ�ڵ���ʧȥ��Ӧ��

> Qt for android �Ļ������⣬֧�� Qt for Android ���Ǹ� Activity �����ٺ�Ȼ������������������⣬�޷��ٴγ�ʼ�� Qt �����������ġ�

[Qt application freezes after wakeup on android](https://bugreports.qt.io/browse/QTBUG-44339)

Ӧ��������̨ʱ�ᴥ�� `Qt.application.stateChanged` �źţ��� `Qt.application.state` ������ `Qt.ApplicationActive` ʱ���ǵñ���Ӧ�õ�ǰ��״̬���������е�����

## ��Ϊ�ֻ����빤��ģʽ

[ubuntu14.04�дqt for android����](http://blog.csdn.net/u012160436/article/details/50640626)һ�������Ļ�Ϊ�ֻ����빤��ģʽ�Ĵ��룬����Щ��Ϊ�ֻ���Ч�ġ�

## ��׿�ı���

�ֽ׶Σ�Qt û��ֱ���ṩ�ı���ĸ���ճ����

## ��׿ 4 ��ʹ�� Qt �Ķ�ý���ܳ��ֱ���

��׿�汾 4.4 ���� 4.2.2.

�� `pro` �ļ���ע��ģ����ӵ�˳��

> pro�ļ����� += quick ���� multimedia ǰ�档�����Ϻ�Qt����ȺȺ�ѡ�

## ListView �ڰ�׿�ϣ������ٶ�Ϊ����

> �������� Qt 5.7.0 ���Ѿ������Qt 5.6 û�в��ԡ�

> `ListView` ���ֻ��������������󡣸о�����û��Androidԭ��ϵͳ��ô�����������Ϻ�Qt����ȺȺ�ѡ�

�����һ���򵥵�ʾ����

```
ListView {
    delegate: Rectangle {
         Text { anchors.centerIn: parent; text: index }
    }
    model: 20
}
```

Ȼ���ڰ�׿�����У�����ʱ�����в��������»�������б���ᷢ��һЩϸ�ڣ�

1. �����ٶ�Ϊ���Ե�

2. û�������ȼ���Ȼ����ٵı��֡�

����Ҫ���� `ListView` ��ʲô���ԣ����们���ٶ����û��Ļ�����ʽ������һЩ��Ӧ�أ������û����ٻ���ʱ��ListView �Ļ����ٶ����������½���

[���������۵�ַ](http://qtdream.com/topic/551/listview-%E5%9C%A8%E5%AE%89%E5%8D%93%E4%B8%8A-%E6%BB%91%E5%8A%A8%E9%80%9F%E5%BA%A6%E4%B8%BA%E7%BA%BF%E6%80%A7)��

## adb ����

[adb server is out of date. killing������� ](http://blog.csdn.net/liranke/article/details/42524851)

[Failure [INSTALL_FAILED_UPDATE_INCOMPATIBLE] ](http://blog.csdn.net/hudashi/article/details/6877304)

��Ҫ�� apk �������⡣

> PS ����ֱ���޸���İ���
