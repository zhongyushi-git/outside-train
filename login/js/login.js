$(function() {
	layui.use(['carousel', 'form'], function() {
		var carousel = layui.carousel,
			form = layui.form;

		//自定义验证规则
		form.verify({
			userName: function(value) {
				if (value.length < 5) {
					return '账号至少得5个字符';
				}
			},
			pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格']
		});
		//设置轮播主体高度
		var zyl_login_height = $(window).height() / 1.3;
		var zyl_car_height = $(".zyl_login_height").css("cssText", "height:" + zyl_login_height + "px!important");
		//Login轮播主体
		carousel.render({
			elem: '#zyllogin', //指向容器选择器
			width: '100%', //设置容器宽度
			height: 'zyl_car_height',
			arrow: 'always', //始终显示箭头
			anim: 'fade', //切换动画方式
			autoplay: true, //是否自动切换false true
			arrow: 'hover', //切换箭头默认显示状态||不显示：none||悬停显示：hover||始终显示：always
			indicator: 'none', //指示器位置||外部：outside||内部：inside||不显示：none
			interval: '5000', //自动切换时间:单位：ms（毫秒）
		});
		//监听轮播--案例暂未使用
		carousel.on('change(zyllogin)', function(obj) {
			var loginCarousel = obj.index;
		});
		//粒子线条
		$(".zyl_login_cont").jParticle({
			background: "rgba(0,0,0,0)", //背景颜色
			color: "#fff", //粒子和连线的颜色
			particlesNumber: 100, //粒子数量
			particle: {
				minSize: 1, //最小粒子
				maxSize: 3, //最大粒子
				speed: 30, //粒子的动画速度
			},
		});
		//监听提交
		form.on('submit(login)', function(data) {
			if (checkVercode(data.field.vercode)) {
				loginVerify(data.field)
			}
			return false;
		});
	});

	displayImage();

	//切换图片验证码
	$("#image img").click(function() {
		displayImage();
	});
	$("#image a").click(function() {
		displayImage();
	});
	
	$("#missPassword").click(function(){
		alert("密码忘记请联系系统管理员重置！")
	})
});
//显示图片验证码
function displayImage() {
	$("#image img").attr("src", WebAPI.system + "login/getImageCode?time=" + new Date().getTime());
}
//图片验证码验证
function checkVercode(vercode) {
	var flag = false; //默认验证码错误
	$.ajax({
		url: WebAPI.system + "login/checkVercode",
		async: false,
		data: {
			vercode: vercode
		},
		success: function(data) {
			if (data.msg != "success") {
				$("#message").html("验证码错误");
				flag = false;
				return;
			} else {
				$("#message").html("");
				flag = true;
			}
		},
		error:function(){
			$("#message").html("验证码发送错误，请稍后再试");
		}
	})
	return flag;
}
function loginVerify(d){
	$.post(WebAPI.system + "login/login", {
			username: base.encode(d.username+"&"+d.role),
			password: base.encode(d.password),
		},
		function(data) {
			if(data.code!=200){
				$("#message").html(data.msg);
			}else{
				$("#message").html("登录成功");
				sessionStorage.setItem("token",data.token);
				sessionStorage.setItem("user",btoa(encodeURIComponent(JSON.stringify(data.user))));
				localStorage.setItem('role',d.role)
				var url=(window.location.search).split("?gotoUrl=");
				var gotoUrl=url.length==2?url[1]:null;
				window.location.href=gotoUrl!=null?gotoUrl:'../'+d.role+'/index.html';
			}
		})
}
var base = new Base64();
//base64加密与解密，
function Base64() {  
    // private property  
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";  
    // public method for encoding  
    this.encode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = _utf8_encode(input);  
        while (i < input.length) {  
            chr1 = input.charCodeAt(i++);  
            chr2 = input.charCodeAt(i++);  
            chr3 = input.charCodeAt(i++);  
            enc1 = chr1 >> 2;  
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
            enc4 = chr3 & 63;  
            if (isNaN(chr2)) {  
                enc3 = enc4 = 64;  
            } else if (isNaN(chr3)) {  
                enc4 = 64;  
            }  
            output = output +  
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +  
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);  
        }  
        return output;  
    }  
    // public method for decoding  
    this.decode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3;  
        var enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
        while (i < input.length) {  
            enc1 = _keyStr.indexOf(input.charAt(i++));  
            enc2 = _keyStr.indexOf(input.charAt(i++));  
            enc3 = _keyStr.indexOf(input.charAt(i++));  
            enc4 = _keyStr.indexOf(input.charAt(i++));  
            chr1 = (enc1 << 2) | (enc2 >> 4);  
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
            chr3 = ((enc3 & 3) << 6) | enc4;  
            output = output + String.fromCharCode(chr1);  
            if (enc3 != 64) {  
                output = output + String.fromCharCode(chr2);  
            }  
            if (enc4 != 64) {  
                output = output + String.fromCharCode(chr3);  
            }  
        }  
        output = _utf8_decode(output);  
        return output;  
    }  
    // private method for UTF-8 encoding  
    _utf8_encode = function (string) {  
        string = string.replace(/\r\n/g,"\n");  
        var utftext = "";  
        for (var n = 0; n < string.length; n++) {  
            var c = string.charCodeAt(n);  
            if (c < 128) {  
                utftext += String.fromCharCode(c);  
            } else if((c > 127) && (c < 2048)) {  
                utftext += String.fromCharCode((c >> 6) | 192);  
                utftext += String.fromCharCode((c & 63) | 128);  
            } else {  
                utftext += String.fromCharCode((c >> 12) | 224);  
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);  
                utftext += String.fromCharCode((c & 63) | 128);  
            }  

        }  
        return utftext;  
    }  
    // private method for UTF-8 decoding  
    _utf8_decode = function (utftext) {  
        var string = "";  
        var i = 0;  
        var c = c1 = c2 = 0;  
        while ( i < utftext.length ) {  
            c = utftext.charCodeAt(i);  
            if (c < 128) {  
                string += String.fromCharCode(c);  
                i++;  
            } else if((c > 191) && (c < 224)) {  
                c2 = utftext.charCodeAt(i+1);  
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));  
                i += 2;  
            } else {  
                c2 = utftext.charCodeAt(i+1);  
                c3 = utftext.charCodeAt(i+2);  
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  
                i += 3;  
            }  
        }  
        return string;  
    }  
}
