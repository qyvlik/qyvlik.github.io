# MySQL 使用笔记

> 作者 [qyvlik](http://blog.qyvlik.space)

> 垃圾 MySQL，毁我青春。

在 Window7 下我重新安装了 MySQL 5.7，尝试连接数据库时报如下错误：

> Error 2003(HY000) Can't connect to MySQL server (10060) 

发现是本地 MySQL 服务无法启动。

使用了 [MySQL 5.6](http://cdn.mysql.com/archives/mysql-5.6/mysql-5.6.29-winx64.zip)，这个是解压版。

解压后，找到 **mysqld.exe** 然后在终端运行如下命令注册 MySQL 服务：

```
mysqld.exe -install
net start mysql
```

注册服务后，启动，一般会成功的，如果不成功，就再换个低版本的试试。

然后这个解压版是没有设置密码的，用户名为 root，所以如果使用如下命令在终端进入 MySQL：

```
mysql -u root -p
```

但是输入 `root` 这个密码的话，是会报错：

> ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)

所以控制台下直接输入 `mysql` 就可以进入。

重设密码的时候出现：

> ERROR 1044 (42000): Access denied for user ''@'localhost' to database 'mysql'

妈个鸡，用个解压版的 mysql 这么多麻烦。

问题解决，参考这篇文章 [ERROR 1044 (42000): Access denied for user ''@'localhost' to database 'mysql'](http://blog.sina.com.cn/s/blog_7d31bbee01012pkz.html)。

先新建一个 `my.ini` 在 MySQL 的根目录下。

```
[mysqld]

skip-external-locking
skip-name-resolve
skip-grant-tables

sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES 
```

写入上诉内容。

然后在控制台键入 `mysql` 默认用户进入 `mysql`，然后在 `mysql` 中输入 `UPDATE user SET Password=PASSWORD('root') where USER='root';` 即可修改密码为 root。

至此，我终于可以说，垃圾 MySQL，毁我青春。