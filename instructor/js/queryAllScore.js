var layer, laydate, table, form;
//获取当前页码
var currPageNum = $(".layui-laypage-em").next().html();
//记录选中的学号
var data = null;
var index;
$(function () {
    layui.use(['layer', 'table', 'form'], function () {
        layer = layui.layer,
            table = layui.table,
            form = layui.form;

        getTermList();
        getClassList();
        inintTable();
    })

    //按钮的监听
    $("#search").click(function () {
        reloadTable();
    });
    $("#clear").click(function () {
        $("input[name='name']").val('');
        $("input[name='username']").val('');
    })
    $("#term_id").change(function () {
        getPlanList();
    })


})

//初始化表格
function inintTable() {
    var json = getValue();
    table.render({
        elem: '#table',
        url: WebAPI.student + 'score/queryReplyByTea?term_id=' + json.term_id + '&classes=' + json.classes + '&username=' +
            json.username + '&name=' + json.name,
        page: true,
        id: 'tableReload',
        cols: [
            [{
                field: 'username',
                title: '学号',
                unresize: true,
                align: 'center',
            },
                {
                    field: 'name',
                    title: '姓名',
                    unresize: true,
                    align: 'center'
                },
                {
                    field: 'classes',
                    title: '班级',
                    unresize: true,
                    align: 'center',
                },
                {
                    field: 'all_score',
                    title: '综合成绩',
                    unresize: true,
                    align: 'center',
                    width: 100,
                    templet: function (d) {
                        if (d.all_score == 0 || d.all_score == null) {
                            d.all_score = '-';
                        }
                        return d.all_score
                    }
                }
            ]
        ],
    })
}

//搜索时重载表格
function reloadTable() {
    var json = getValue();
    table.reload('tableReload', {
        url: WebAPI.student + 'score/queryReplyByTea?term_id=' + json.term_id + '&classes=' + json.classes + '&username=' +
            json.username + '&name=' + json.name,
        page: {
            curr: 1, //设置当前页面为第一页
        },
    }, 'data')
}

//获取输入的内容
function getValue() {
    var json = {};
    json.term_id = $("select[name='id']").val();
    json.classes = $("select[name='classes']").val();
    json.username = $("input[name='username']").val();
    json.name = $("input[name='name']").val();
    return json;
}

//获取学期信息
function getTermList() {
    $.ajax({
        url: WebAPI.manage + 'term/getTermList',
        async: false,
        success: function (data) {
            $("#term_id").html('');
            var select = '';
            for (var i = 0; i < data.length; i++) {
                select += '<option value="' + data[i].term_id + '">' + data[i].term + '</option>';
            }
            $("#term_id").append(select);
        },
        error: function () {
            layer.alert("查询学期信息发生错误");
        }
    })
    getPlanList()
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

//获取实训计划信息
function getPlanList() {
    var term_id = $("#term_id").val();
    if (term_id == null || term_id == '') return;
    $.ajax({
        url: WebAPI.teacher + 'trainPlan/getPlanList?term_id=' + term_id,
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
