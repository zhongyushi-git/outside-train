var layer, laydate, table, form;
//获取当前页码
var currPageNum = $(".layui-laypage-em").next().html();
//记录选中的学号和实训成绩
var arr = [];
var parentData;
var index;
$(function () {
    layui.use(['layer', 'laydate', 'table', 'form'], function () {
        layer = layui.layer,
            laydate = layui.laydate,
            table = layui.table,
            form = layui.form;

        getTermList();
        inintTable();

        //监听单选框事件
        table.on('radio(table)', function (obj) {
            var d = obj.data;
            if (obj.checked) {
                arr[0] = d.id;
            }
        });
    });


    $("#search").click(function () {
        reloadTable()
    });
    //当单击表格行时,把单选按钮设为选中状态
    $(document).on("click", ".layui-table-body table.layui-table tbody tr", function () {
        var obj = event ? event.target : event.srcElement;
        var tag = obj.tagName;
        var checkbox = $(this).find("td div.laytable-cell-radio div.layui-form-radio I");
        if (checkbox.length != 0) {
            if (tag == 'DIV') {
                checkbox.click();
            }
        }
    });
    $(document).on("click", "td div.laytable-cell-radio div.layui-form-radio", function (e) {
        e.stopPropagation();
    })
    $("#update").click(function () {
        if (arr == null || arr.length == 0) {
            layer.msg("请先选中一行数据");
            return;
        }
        getOne();
        index = layer.open({
            type: 2,
            btn: false,
            area: ['400px', '360px'],
            title: ['信息修改', '15px'],
            content: '../html/updateAttendAndWork.html'
        })
    })


})

//初始化表格
function inintTable() {
    var json = getValue();
    table.render({
        elem: '#table',
        url: WebAPI.teacher + 'trainPlan/getList?term_id=' + json.term_id,
        page: true,
        id: 'tableReload',
        height: 'full-235',
        cols: [
            [{
                type: 'radio'
            },
                {
                    field: 'id',
                    title: 'id',
                    hide: true
                },
                {
                    field: 'train_name',
                    title: '实训名称',
                    unresize: true,
                    align: 'center'
                },
                {
                    field: 'start_time',
                    title: '实训开始时间',
                    unresize: true,
                    align: 'center'
                },
                {
                    field: 'end_time',
                    title: '实训结束时间',
                    unresize: true,
                    align: 'center'
                },
                {
                    field: 'day',
                    title: '实训天数',
                    unresize: true,
                    align: 'center',
                    width: 120
                },
                {
                    field: 'train_count',
                    title: '应考勤次数',
                    unresize: true,
                    align: 'center',
                    width: 120
                },
                {
                    field: 'train_count2',
                    title: '考勤预警次数',
                    unresize: true,
                    align: 'center',
                }, {
                field: 'work_count',
                title: '作业应交次数',
                unresize: true,
                align: 'center',
                width: 120
            }, {
                field: 'work_count2',
                title: '作业预警次数',
                unresize: true,
                align: 'center',
            },
            ]
        ],
    })
}

//搜索时重载表格
function reloadTable() {
    var json = getValue();
    table.reload('tableReload', {
        url: WebAPI.teacher + 'trainPlan/getList?term_id=' + json.term_id,
        page: {
            curr: 1, //设置当前页面为第一页
        },
    }, 'data')
}

function getValue() {
    var json = {};
    json.term_id = $("#term_id").val();
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
}

//查询一条计划
function getOne() {
    $.ajax({
        url: WebAPI.teacher + 'trainPlan/getOne/' + arr[0],
        type: 'get',
        async: false,
        success: function (data) {
            parentData = data;
        }, error: function (err) {
            console.log(err)
        }
    })
}
