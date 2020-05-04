 $(function () {
        layui.use('form', function () {
            var form = layui.form;

            //自定义验证规则
            form.verify({
                password: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格']
            })
            form.on('submit(submitBtn)', function (data) {
                data.field.password = Base64.encode(data.field.password);//前端加密
                regist(data.field);
                return false;
            })

        });

        $("#reg").click(function () {
            $("#regist").css("display", "block");
        })

        $("#closeBtn").click(function () {
            $("#regist").css("display", "none");
        })
        $("#close").click(function () {
            $("#regist").css("display", "none");
        })

    })

    //注册
    function regist(d) {
        $.ajax({
            url: WebAPI.manage + "engineer/regist",
            data: JSON.stringify(d),
            type: 'post',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },//加上头部信息
            success: function (res) {
                if (res.code == 200) {
                    layer.alert("注册成功, 管理员会在2小时内审核，请审核通过后进行登录",function(){
						$("#regist").css("display", "none");
						window.location.href="login.html"
					});
                } else {
                    layer.alert("此手机号已被注册，请更换手机号注册或直接登录");
                }
            }
        })
    }