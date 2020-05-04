var layer, laydate, table, form;
//获取当前页码
var currPageNum = $(".layui-laypage-em").next().html();
var data;
var user =JSON.parse(decodeURIComponent(atob(sessionStorage.getItem("user"))));
var username=user.username
var total;
$(function () {

    layui.use(['layer', 'laydate', 'table', 'form'], function () {
        layer = layui.layer,
            laydate = layui.laydate,
            table = layui.table,
            form = layui.form;


        laydate.render({
            elem: '#time',
            type: 'datetime',
            trigger: 'click'
        });
        laydate.render({
            elem: '#time2',
            type: 'datetime',
            trigger: 'click'
        });
        $("#term_id").change(function () {
            getPlanList();
        })

        $("#time2").val(dateFormat('YYYY-mm-dd HH:MM:SS', new Date()))
        $("#time").val(dateFormat('YYYY-mm-dd HH:MM:SS', new Date(preDate(1, 7))))

        getTermList();
        inintTable();

    })
    //搜索监听
    $("#search").click(function () {
        reloadTable();
    });

    $("#tableAnalysis").click(function () {
        data = getValue();
        layer.open({
            type: 2,
            btn: false,
            area: ['620px', '620px'],
            title: ['考勤分析', '15px'],
            content: '../html/attendanceDetail.html'
        })
    })

})

//初始化表格
function inintTable() {
    var data = getValue();
    table.render({
        elem: '#table',
        url: WebAPI.engineer + 'attend/getListToTime?term_id=' + data.term_id + '&times=' +
            data.times + '&username=' + data.username,
        page: true,
        id: 'tableReload',
        height: 'full-235',
        cols: [
            [
                {
                    field: 'username',
                    title: '学号',
                    unresize: true,
                    align: 'center',
                },
                {
                    field: 'name',
                    title: '姓名',
                    unresize: true,
                    align: 'center',
                }, {
                field: 'classes',
                title: '班级',
                unresize: true,
                align: 'center',
            },
                {
                    field: 'term_id',
                    title: '实训名称',
                    unresize: true,
                    align: 'center',
                },
                {
                    field: 'attend_time',
                    title: '考勤时间',
                    unresize: true,
                    align: 'center',
                },
                {
                    field: 'attend_teacher',
                    title: '考勤者',
                    unresize: true,
                    align: 'center',
                }, {
                field: 'attend_addr',
                title: '考勤地点',
                unresize: true,
                align: 'center',
            }, {
                field: 'attend_remark',
                title: '备注',
                unresize: true,
                align: 'center',
            },
            ]
        ], done: function (res, curr, count) {
            total = count;
        }
    })
}

//搜索时重载表格
function reloadTable(username) {
    var data = getValue();
    table.reload('tableReload', {
        url: WebAPI.engineer + 'attend/getListToTime?term_id=' + data.term_id + '&times=' +
            data.times + '&username=' + data.username,
        page: {
            curr: 1, //设置当前页面为第一页
        },
    }, 'data')
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

function getValue() {
    var json = {};
    json.term_id = $("#id").val();
    json.username = username;
    json.times = $("#time").val() + ',' + $("#time2").val();
    return json;
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