var index;
$(function(){
	var layer;
	layui.use('layer', function() {
		 layer= layui.layer;
	});
	//下拉树的动态css设置
	$("#sidebar-menu li a").click(function() {
		var d = $(this),
			e = d.next();
		if (e.is(".treeview-menu") && e.is(":visible")) {
			e.slideUp(500, function() {
					e.removeClass("menu-open")
				}),
				e.parent("li").removeClass("active")
		} else if (e.is(".treeview-menu") && !e.is(":visible")) {
			var f = d.parents("ul").first(),
				g = f.find("ul:visible").slideUp(500);
			g.removeClass("menu-open");
			var h = d.parent("li");
			e.slideDown(500, function() {
				e.addClass("menu-open"),
					f.find("li.active").removeClass("active"),
					h.addClass("active");
	
				var _height1 = $(window).height() - $("#sidebar-menu >li.active").position().top - 41;
				var _height2 = $("#sidebar-menu li > ul.menu-open").height() + 10
				if (_height2 > _height1) {
					$("#sidebar-menu >li > ul.menu-open").css({
						overflow: "auto",
						height: _height1
					})
				}
			})
		}
		e.is(".treeview-menu");
	});
	
	//鼠标移动到姓名位置显示用户的操作
	$("#top .user-info").mouseover(function(){
		$("#top .user-info .user-info-edit").css("display","block")
	})
	$("#top .user-info").mouseout(function(){
		$("#top .user-info .user-info-edit").css("display","none")
	})
	
	//动态iframe加载页面设置
	$("li.treeview ul li").click(function(){
		var src=$(this).find("a").attr("data-url");
		$("iframe[name='iframe']").attr("src",src)
	})
})
var user =JSON.parse(decodeURIComponent(atob(sessionStorage.getItem("user"))));
$("#username").html("欢迎您，"+user.name+" 企业工程师")
//修改密码
function updatePwd() {
	index = layer.open({
		type: 2,
		btn: false,
		area: ['380px', '230px'],
		title: ['修改密码', '15px'],
		content: 'html/updatePwd.html'
	})
}