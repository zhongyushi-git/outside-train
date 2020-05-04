var layer, laydate, table, form;
//获取当前页码
var currPageNum = $(".layui-laypage-em").next().html();
//记录选中的学号
var arr = [],
    data = null;
var index;
var user =JSON.parse(decodeURIComponent(atob(sessionStorage.getItem("user"))));
$(function () {
    layui.use(['layer', 'table', 'form'], function () {
        layer = layui.layer,
            table = layui.table,
            form = layui.form;

        getTermList();
        getClassList();
        initTable();

        $("#clear").click(function () {
            $("input[name='name']").val('');
            $("input[name='username']").val('');
        })

        // 当单击表格行时,把多选按钮设为选中状态
        $(document).on("click", ".layui-table-body table.layui-table tbody tr", function () {
            var obj = event ? event.target : event.srcElement;
            var tag = obj.tagName;
            var checkbox = $(this).find("td div.laytable-cell-checkbox div.layui-form-checkbox I");
            if (checkbox.length != 0) {
                if (tag == 'DIV') {
                    checkbox.click();
                }
            }
        });
        $(document).on("click", "td div.laytable-cell-checkbox div.layui-form-checkbox", function (e) {
            e.stopPropagation();
        });

    })

//按钮的监听
    $("#search").click(function () {
        reloadTable(1)
    });
    $("#addAttend").click(function () {
        getCkecked();
        if (arr.length == 0) {
            layer.msg('请选择一行数据');
            return;
        } else if (arr.length > 1) {
            layer.msg('只能选择一行数据');
            return;
        }
        index = layer.open({
            type: 2,
            btn: false,
            area: ['380px', '490px'],
            title: ['添加考勤信息', '15px'],
            content: '../html/addAttend.html'
        })
    });
    $("#addMoreAttend").click(function () {
        getCkecked();
        if (arr.length == 0) {
            layer.msg('至少选择一行数据');
            return;
        }
        var attend_teacher =user.name;
        //base64加密
        arr = Base64.encode(arr)
        $.get(WebAPI.engineer + 'attend/addMoreAttend/' + arr + '/' + attend_teacher, function (data) {
            if (data.code == 200) {
                layer.msg("批量记录成功");
                reloadTable(currPageNum);
            } else {
                layer.msg(data.msg);
            }
        })

    });

})

//初始化表格
function initTable() {
    var json = getValue();
    table.render({
        elem: '#table',
        url: WebAPI.manage + 'student/getStudentListByAdmin?class_id=' + json.classes + '&username=' +
            json.username + '&name=' + json.name,
        page: true,
        id: 'tableReload',
        height: 'full-235',
        cols: [
            [{
                type: 'checkbox'
            },
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
                    align: 'center'
                },
                {
                    field: 'classes',
                    title: '班级',
                    unresize: true,
                    align: 'center',
                },
            ]
        ],
    })
}

//搜索时重载表格
function reloadTable(curr) {
    var json = getValue();
    data = null;
    table.reload('tableReload', {
        url: WebAPI.manage + 'student/getStudentListByAdmin?class_id=' + json.classes + '&username=' +
            json.username + '&name=' + json.name,
        page: {
            curr: curr, //设置当前页面为第一页
        },
    }, 'data')
}

//获取输入的内容
function getValue() {
    var json = {};
    json.term_id = $("select[name='term_id']").val();
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

//获取选中的数据
function getCkecked() {
    arr = [];
    data = null;
    var status = table.checkStatus("tableReload");
    $(status.data).each(function (index, obj) {
        data = obj;
        arr.push(obj.username);
    })
}
