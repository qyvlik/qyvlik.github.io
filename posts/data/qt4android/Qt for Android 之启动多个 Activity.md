# 启动多个 Activity

```
QAndroidJniObject param1 = QAndroidJniObject::fromString(packageName);
QAndroidJniObject param2 = QAndroidJniObject::fromString(localClassName);
 
QAndroidJniObject intent("android/content/Intent","()V");
intent.callObjectMethod("setClassName",
	"(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;",
	param1.object<jstring>(),
	param2 .object<jstring>());
 
QtAndroid::startActivity(intent, 0);
```

> 上面的packageName是要调用的应用的包名，localClassName是要调用的应用的Activity的localClassName，对于Qt应用来说一般是"org.qtproject.qt5.android.bindings.QtActivity"。

[Qt Android 怎么启动其他Android程序？？](http://bbs.csdn.net/topics/391113217)
