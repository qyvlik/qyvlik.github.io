# JavaWeb项目缓存从 ehcache 切换到 redis

由于项目一直用 `ehcache` 作为缓存，不过相对于 `redis`，`ehcache` 的缓存实现依赖于 `jvm`，若想与其他语言的项目交互，恐怕会吃不少苦头。

## pom.xml 依赖

```
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>2.5.1</version>
</dependency>
<dependency>
    <groupId>commons-pool</groupId>
    <artifactId>commons-pool</artifactId>
    <version>1.6</version>
</dependency>
<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-redis</artifactId>
    <version>1.3.4.RELEASE</version>
</dependency>
```

## 新建接口

`ICacheManager.class`

```
public interface ICacheManager {
    <T extends Object> T get(String cacheName, Object key);

    void put(String cacheName, Object key, Object value);

    void remove(String cacheName, Object key);

    void removeAll(String cacheName);
}
```

## redis 实现

### `RedisCacheManagerImpl.class`

```
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.data.redis.cache.RedisCacheManager;

/**
 * Created by qyvlik on 2017/6/26.
 */
public class RedisCacheManagerImpl implements ICacheManager {

    // 见下文配置文件
    public final static RedisCacheManager redisCacheManager = SpringContextHolder.getBean("redisCacheManager");

    protected static CacheManager getCacheManager() {
        return redisCacheManager;
    }

    @Override
    public <T extends Object> T get(String cacheName, Object key) {
        Cache cache = getCacheManager().getCache(cacheName);
        Cache.ValueWrapper valueWrapper = cache.get(key);
        return (T) valueWrapper.get();
    }

    @Override
    public void put(String cacheName, Object key, Object value) {
        Cache cache = getCacheManager().getCache(cacheName);
        cache.put(key, value);
    }

    @Override
    public void remove(String cacheName, Object key) {
        Cache cache = getCacheManager().getCache(cacheName);
        cache.evict(key);
    }

    @Override
    public void removeAll(String cacheName) {
        Cache cache = getCacheManager().getCache(cacheName);
        cache.clear();
    }
}
```

### `spring-redis.xml`

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns="http://www.springframework.org/schema/beans" xsi:schemaLocation="
		http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
		http://www.springframework.org/schema/context  http://www.springframework.org/schema/context/spring-context-3.2.xsd">

    <description>Jedis Configuration</description>


    <bean id="jedisPoolConfig" class="redis.clients.jedis.JedisPoolConfig">
        <property name="maxIdle" value="300"/>
        <!-- 最大能够保持idel状态的对象数  -->
        <property name="maxTotal" value="60000"/>
        <!-- 最大分配的对象数 -->
        <property name="testOnBorrow" value="true"/>
        <!-- 当调用borrow Object方法时，是否进行有效性检查 -->
    </bean>

    <bean id="redisConnectionFactory" class="org.springframework.data.redis.connection.jedis.JedisConnectionFactory">
        <property name="hostName" value="127.0.0.1"/>  <!-- 这里填写 redis IP -->
        <property name="port" value="6379"/>
        <property name="usePool" value="true"/>
        <property name="poolConfig" ref="jedisPoolConfig"/>
    </bean>

    <bean id="redisTemplate" class="org.springframework.data.redis.core.RedisTemplate">
        <property name="connectionFactory" ref="redisConnectionFactory"/>
    </bean>

    <bean id="redisCacheManager" class="org.springframework.data.redis.cache.RedisCacheManager">
        <constructor-arg index="0" ref="redisTemplate"/>
    </bean>
</beans>
```

> 注意，这里是单机版的 redis 配置，主从配置，请自行查找

## ehcache 实现

### `EhCacheManagerImpl.class`

```
import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;

/**
 * Created by qyvlik on 2017/6/26.
 */
public class EhCacheManagerImpl implements ICacheManager {
    // 见下文配置文件
    public final static CacheManager cacheManager = SpringContextHolder.getBean("cacheManager");

    protected static CacheManager getCacheManager() {
        return cacheManager;
    }

    /**
     * 获得一个Cache，没有则创建一个。
     *
     * @param cacheName
     * @return
     */
    private static synchronized Cache getCache(String cacheName) {
        Cache cache = getCacheManager().getCache(cacheName);
        if (cache == null) {
            getCacheManager().addCache(cacheName);
            cache = getCacheManager().getCache(cacheName);
            cache.getCacheConfiguration().setEternal(true);
        }
        return cache;
    }

    @Override
    public <T extends Object> T get(String cacheName, Object key) {
        Element element = getCache(cacheName).get(key);
        return element == null ? null : (T) element.getObjectValue();
    }

    @Override
    public void put(String cacheName, Object key, Object value) {
        Element element = new Element(key, value);
        getCache(cacheName).put(element);
    }

    @Override
    public void remove(String cacheName, Object key) {
        getCache(cacheName).remove(key);
    }

    @Override
    public void removeAll(String cacheName) {
        Cache cache = getCacheManager().getCache(cacheName);
        cache.removeAll(true);
    }
}
```

### `ehcache.xml`

```
<?xml version="1.0" encoding="UTF-8"?>
<ehcache updateCheck="false" name="defaultCache">

    <diskStore path="java.io.tmpdir/otc"/>

    <!-- 默认缓存配置. -->
    <defaultCache maxEntriesLocalHeap="100" eternal="false" timeToIdleSeconds="300" timeToLiveSeconds="600"
                  overflowToDisk="true" maxEntriesLocalDisk="100000"/>
</ehcache>
```

> 注意，这里是单机版的 ehcache 配置，集群配置，请自行查找

## `SpringContextHolder.class`

```
package com.rich.common.utils;

import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

/**
 * 以静态变量保存Spring ApplicationContext, 可在任何代码任何地方任何时候取出ApplicaitonContext.
 */
@Service
@Lazy(false)
public class SpringContextHolder implements ApplicationContextAware, DisposableBean {

    private static ApplicationContext applicationContext = null;

    private static Logger logger = LoggerFactory.getLogger(SpringContextHolder.class);

    /**
     * 取得存储在静态变量中的ApplicationContext.
     */
    public static ApplicationContext getApplicationContext() {
        assertContextInjected();
        return applicationContext;
    }

    /**
     * 实现ApplicationContextAware接口, 注入Context到静态变量中.
     */
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) {
        SpringContextHolder.applicationContext = applicationContext;
    }

    /**
     * 从静态变量applicationContext中取得Bean, 自动转型为所赋值对象的类型.
     */
    @SuppressWarnings("unchecked")
    public static <T> T getBean(String name) {
        assertContextInjected();
        return (T) applicationContext.getBean(name);
    }

    /**
     * 从静态变量applicationContext中取得Bean, 自动转型为所赋值对象的类型.
     */
    public static <T> T getBean(Class<T> requiredType) {
        assertContextInjected();
        return applicationContext.getBean(requiredType);
    }

    /**
     * 清除SpringContextHolder中的ApplicationContext为Null.
     */
    public static void clearHolder() {
        if (logger.isDebugEnabled()) {
            logger.debug("清除SpringContextHolder中的ApplicationContext:" + applicationContext);
        }
        applicationContext = null;
    }

    /**
     * 检查ApplicationContext不为空.
     */
    private static void assertContextInjected() {
        Validate.validState(applicationContext != null, "applicaitonContext属性未注入, 请在applicationContext.xml中定义SpringContextHolder.");
    }

    /**
     * 实现DisposableBean接口, 在Context关闭时清理静态变量.
     */
    @Override
    public void destroy() throws Exception {
        SpringContextHolder.clearHolder();
    }
}
```

[Spring 整合Redis 出现 afterPropertiesSet signature: ()V) Incompatible argument to function 解决办法](http://www.cnblogs.com/zhengbn/p/4138085.html)

[Caused by: java.lang.NoClassDefFoundError: org/apache/commons/pool/impl/GenericObjectPool](http://www.blogjava.net/lusm/archive/2007/09/28/149363.html)

[使用Spring Data + Redis实现缓存](http://www.jdon.com/repository/redis.html)

