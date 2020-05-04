var WebAPI = {
	'student': '../../../training/student/',
	'teacher': '../../../training/teacher/',
	'engineer': '../../../training/engineer/',
	'instructor': '../../../training/instructor/',
	'manage': '../../../training/manage/',
	'system': '../../../training/system/',
}
//角色页面跳转
function forwardPage(role) {
	var url = '../'
	switch (role) {
		case "student":
			url += 'student'
			break;
		case "teacher":
			url += 'teacher'
			break;
		case "instructor":
			url += 'instructor'
			break;
		case "engineer":
			url += 'engineer'
			break;
	}
	url += '/index.html'
	window.location.href = url
}

//退出登录
function exit(){
	$.get(WebAPI.system+"login/logout",function(data){
		if(data.code==200){
			localStorage.clear();
			sessionStorage.clear();
			window.location.href=loginUrl;
		}else{
			alert("退出失败")
		}
	})
}
var userRole = localStorage.getItem("role")
var loginUrl = '../login/login.html'
var base_url = location.protocol + location.host;
var token = sessionStorage.getItem("token");
var pathname = location.pathname

//设置请求头中带token, 全局处理认证问题
$.ajaxSetup({
	beforeSend: function(xhr) {
		xhr.setRequestHeader('token', token == null ? "" : token);
	}
})
//页面认证，不登录无法访问
if (token == null||userRole==null) {
	if (!pathname.endsWith("login.html")&&!pathname.endsWith("regist.html")) {
		var href = ''
		if (window != top){
			top.location.href = location.href;
		}
		if (!pathname.includes(userRole)) {
			if (pathname.endsWith("index.html")) {
				href = loginUrl
			} else {
				href = '../' + loginUrl
			}
			window.location.href = href
		}
	}
} else {
	if (!pathname.endsWith("login.html")&&!pathname.endsWith("regist.html")) {
		var href = ''
		if (!pathname.includes(userRole)) {
			if (pathname.endsWith("index.html")) {
				href = loginUrl
			} else {
				href = '../' + loginUrl
			}
			window.location.href = href
		}
	}
}
var loginUser =JSON.parse(decodeURIComponent(atob(sessionStorage.getItem("user"))));





