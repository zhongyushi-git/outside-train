var layer, laydate, table, form;
//获取当前页码
var currPageNum = $(".layui-laypage-em").next().html();
//记录选中的学号
var username_checked = 0;
var status_arr = ['待审核', '已通过', '未通过', '-'];
$(function () {
    layui.use(['layer', 'table', 'form'], function () {
        layer = layui.layer,
            table = layui.table,
            form = layui.form;

        getClassList();
        inintTable();
        listenTool();

    })

    //按钮的监听
    $("#search").click(function () {
        reloadTable()
    });
    $("#clear").click(function () {
        $("input[name='name']").val('');
        $("input[name='username']").val('');
    })

})

//初始化表格
function inintTable() {
    var json = getValue();
    table.render({
        elem: '#table',
        url: WebAPI.instructor + 'leave/getLeaveListByIns?classes=' + json.classes + '&username=' + json.username + '&name=' + json.name +
            '&leave_status=' + json.leave_status + '&backLeave_status=' + json.backLeave_status,
        page: true,
        id: 'tableReload',
        cols: [
            [{
                field: 'leave_id',
                title: 'ID',
                hide: true
            },
                {
                    field: 'username',
                    title: '学号',
                    unresize: true,
                    align: 'center',
                    width: 120
                },
                {
                    field: 'name',
                    title: '姓名',
                    unresize: true,
                    align: 'center',
                    width: 80
                },
                {
                    field: 'term_id',
                    title: '实训名称',
                    unresize: true,
                    align: 'center',
                },
                {
                    field: 'start_time',
                    title: '请假时间',
                    unresize: true,
                    align: 'center',
                    width: 330,
                    templet: function (d) {
                        if (d.start_time != null && d.end_time != null) {
                            d.start_time = d.start_time + ' 至 ' + d.end_time;
                        }
                        return d.start_time;
                    }
                },
                {
                    field: 'leave_status',
                    title: '请假审批状态',
                    unresize: true,
                    align: 'center',
                    templet: function (d) {
                        return status_arr[d.leave_status]
                    }
                },
                {
                    field: 'backLeave_status',
                    title: '销假审批状态',
                    unresize: true,
                    align: 'center',
                    templet: function (d) {
						if(d.backLeave_status!=null){
							return status_arr[d.backLeave_status]
						}
						return status_arr[3]
                        
                    }
                },
                {
                    fixed: 'right',
                    title: '操作',
                    toolbar: '#topTool',
                    width:400,
                    align: 'center',
                    unresize: true,

                }
            ]
        ],
    })
}

//搜索时重载表格
function reloadTable() {
    var json = getValue();
    table.reload('tableReload', {
        url: WebAPI.instructor + 'leave/getLeaveListByIns?classes=' + json.classes + '&username=' + json.username + '&name=' + json.name +
            '&leave_status=' + json.leave_status + '&backLeave_status=' + json.backLeave_status,
        page: {
            curr: 1, //设置当前页面为第一页
        },
    }, 'data')
}

//监听工具条
function listenTool() {
    //监听工具条
    table.on('tool(table)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if (layEvent === 'detail') {
            layer.open({
                type: 2,
                btn: false,
                area: ['620px', '620px'],
                title: ['请假详情', '15px'],
                content: '../html/leaveDetail.html?id=' + data.leave_id
            })
        } else if (layEvent === 'agree') {
            if (data.leave_status != 0) {
                layer.msg("此请假申请已审核,请勿重复审核");
                return;
            }
            updateLeaveStatus(data.leave_id, 1, 0)
        } else if (layEvent === 'refuse') {
            if (data.leave_status != 0) {
                layer.msg("此请假申请已审核,请勿重复审核");
                return;
            }
            updateLeaveStatus(data.leave_id, 2, 0)
        } else if (layEvent === 'agree2') {
            if (data.backLeave_status != 0) {
                if (data.backLeave_status == 3) {
                    layer.msg("销假申请不存在,不可审核!");
                } else {
                    layer.msg("此销假申请已审核,请勿重复审核");
                }
                return;
            }
            updateLeaveStatus(data.leave_id, 1, 1)
        } else if (layEvent === 'refuse2') {
            if (data.backLeave_status != 0) {
                if (data.backLeave_status == 3) {
                    layer.msg("未销假,不可审核!");
                } else {
                    layer.msg("此销假申请已审核,请勿重复审核");
                }
                return;
            }
            updateLeaveStatus(data.leave_id, 2, 1)
        }
    })
}

//修改审批的状态,id表示的是请假还是销假
function updateLeaveStatus(leave_id, leave_status, id) {
    $.get(WebAPI.instructor + "leave/updateStatus/" + leave_id + '/' + leave_status + '/' + id, function (data) {
        if (data.code == 200) {
            layer.msg("审批成功");
            reloadTable();
        } else {
            layer.msg(data.msg);
        }
    })
}

//获取输入的内容
function getValue() {
    var json = {};
    json.classes = $("select[name='classes']").val();
    json.username = $("input[name='username']").val();
    json.name = $("input[name='name']").val();
    json.leave_status = $("select[name='leave_status']").val();
    json.backLeave_status = $("select[name='backLeave_status']").val();
    return json;
}

//获取班级信息
function getClassList() {
    $.ajax({
        url: WebAPI.manage + 'class/getClassList',
        async: false,
        success: function (data) {
            $("#classes").html('');
            var select = '';
            for (var i = 0; i < data.length; i++) {
                select += '<option value="' + data[i].class_id + '">' + data[i].class_name + '</option>';
            }
            $("#classes").append(select);
        },
        error: function () {
            layer.alert("查询班级信息发生错误");
        }
    })
}

