# Java Web 与 QtQuick

## Java Web 中获取 QtQuick 的表单数据

Java Web 中，在 `post` 方法下，如果  `request.getParameter` 获取为 null，QtQuick 要注意**设置客户端请求头** `setRequestHeader("Content-Type", "application/x-www-form-urlencoded");`。

## Java Web 与 QtQuick 的 Session

由于 QtQuick 的 `XMLHttpRequest` 不支持发送 Cookie 和接受 Cookie。所以 Java Web 服务端怎么标示一个唯一的 QtQuick 应用。

先看如下 Java 代码：

```
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/api/GetJSessionid") 
public class GetJSessionid extends HttpServlet {

	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		HttpSession session = req.getSession();
		PrintWriter writer = resp.getWriter();
		
		String data = "{\"jsessionid\":" + "\"" + session.getId() + "\"}";
		writer.write(data.toCharArray());
		writer.close();
	}
}
```

上诉代码返回一串 JSON，在 QtQuick 便可以获取到 `jsessionid`，然后在使用 **URL 重写**方案来处理 `jsessionid`。不过 **URL 重写**方案已经有些年头了。

QtQuick 中获取 Java Web 的  `jsessionid`。

```
function test() {
    getJSessionId("http://localhost:8080/ForQtQuick/api/GetJSessionid");
}

function getJSessionId(url, callable, err) {
    callable = callable || function(id) {
        console.log(id);
    };
    err = err || function(e) {
        console.log(e);
    };
    var xhr = new XMLHttpRequest;
    xhr.onreadystatechange = function() {
        if(xhr.readyState === xhr.DONE) {
            console.log(xhr.getAllResponseHeaders());
            console.log(xhr.responseText);
            try {
                callable(JSON.parse(xhr.responseText)["jsessionid"]);
            } catch(e) {
                err(e);
            }
        }
    }
    xhr.open("GET", url);
    xhr.send();
}
```

---

[struts2 中的 result 返回类型是 json 的配置问题 ](http://blog.sina.com.cn/s/blog_4fdb887b01013zda.html)

[Struts2和JSON实例](http://www.yiibai.com/struts_2/struts-2-and-json-example.html)只是讲明了如何生成 json，但是更多时候，我们需要传递一些数据进去，才可以获取到一些特定的东西。

[理解HTTP session原理及应用](http://beyond99.blog.51cto.com/1469451/543282/)

[JavaWeb学习总结(十二)——Session](http://www.cnblogs.com/xdp-gacl/p/3855702.html)
