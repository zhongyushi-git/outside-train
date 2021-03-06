var layer, laydate;
var user =JSON.parse(decodeURIComponent(atob(sessionStorage.getItem("user"))));
$(function () {
    layui.use(['layer', 'laydate'], function () {
        layer = layui.layer,
            laydate = layui.laydate;


        laydate.render({
            elem: '#startTime',
            type: 'datetime',
            trigger: 'click',
        });

        laydate.render({
            elem: '#endTime',
            type: 'datetime',
            trigger: 'click',
        });

        getPlanList();
    })


    //保存请假申请
    $("#save").click(function () {
        var json = checkInput();
        if (!json) return;
        $.get(WebAPI.teacher + 'trainPlan/getOne/' + json.term_id, function (data) {
            if (new Date(data.start_time) > new Date(json.start_time)) {
                layer.alert("开始时间不能在实训开始时间之前");
                return;
            } else if (new Date(data.end_time) < new Date(json.end_time)) {
                layer.alert("如需跨实训请假,请依次请假");
                return;
            }
            $.ajax({
                url: WebAPI.instructor + "leave/addLeave",
                type: 'post',
                data: JSON.stringify(json),
                contentType: 'application/json',
                success: function (data) {
                    if (data.code == 200) {
                        layer.alert("请假成功", function (i) {
                            //关闭父级弹框
                            parent.layer.close(window.parent.index1);
							window.parent.reloadTable();
                            layer.close(i)
                        });
                    } else {
                        layer.alert(data.msg);
                    }
                }, error: function (err) {
                    console.log("发生错误" + err)
                }
            })
        })
    })


})

//检查输入的内容
function checkInput() {
    var json = {};
    json.term_id = $("#id").val();
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    var reason = $("textarea[name='reason']").val();
    var remark = $("textarea[name='remark']").val();
    if (startTime.length <= 0 || endTime.length <= 0) {
        layer.msg("请假时间不能为空");
        return;
    } else if (new Date(startTime.replace(/-/g, "/")) >= new Date(endTime.replace(/-/g, "/"))) {
        layer.msg("请假结束时间必须在开始时间之后");
        return;
    } else if (reason.length <= 0) {
        layer.msg("请假原因为必填项");
        return;
    } else {
        json.username =user.username;
        json.start_time = startTime;
        json.end_time = endTime;
        json.leave_reason = reason;
        json.leave_remark = remark;
    }
    return json;
}

//获取实训计划信息
function getPlanList() {
    $.ajax({
        url: WebAPI.teacher + 'trainPlan/getPlanList',
        async: false,
        success: function (data) {
            $("#id").html('');
            var select = '';
            for (var i = 0; i < data.length; i++) {
                select += '<option value="' + data[i].id + '">' + data[i].train_name + '</option>';
            }
            $("#id").append(select);
        },
        error: function () {
            layer.alert("查询学期信息发生错误");
        }
    })
}
