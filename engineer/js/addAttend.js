var data = window.parent.data;//获取父级的数据
var user =JSON.parse(decodeURIComponent(atob(sessionStorage.getItem("user"))));
$(function () {
    layui.use(['layer', 'laydate',], function () {
        var layer = layui.layer,
            laydate = layui.laydate;

        laydate.render({
            elem: '#time1',
            type: 'time',
            trigger: 'click' //采用click弹出
        })

        //初始化输入框
        $("input[name='date1']").val(dateFormat('YYYY-mm-dd', new Date()));
        $("input[name='time1']").val(dateFormat('HH:MM:SS', new Date()));
        $("input[name='username']").val(data.username)
        $("input[name='name']").val(data.name)
        //保存数据
        $("#save").click(function () {
            var d = {};
            d.attend_time = $("input[name='date1']").val() + " " + $("input[name='time1']").val();
            d.attend_addr = $("input[name='attend_addr']").val();
            d.attend_remark = $("textarea[name='attend_remark']").val();
            d.username = $("input[name='username']").val();
            d.attend_teacher =user.name
            $.ajax({
                url: WebAPI.engineer + 'attend/addAttend',
                type: 'post',
                data: JSON.stringify(d),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                success: function (data) {
                    if (data.code == 200) {
                        layer.alert('添加成功', function (i) {
                            parent.layer.close(window.parent.index);
                            layer.close(i)
                        });
                    } else {
                        layer.msg(data.msg)
                    }
                }, error: function (err) {
                    console.log(err);
                }
            })
        })
        $("#cancel").click(function () {
            parent.layer.close(window.parent.index)
        })
    })
})
			