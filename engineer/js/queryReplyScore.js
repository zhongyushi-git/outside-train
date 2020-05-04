var layer, laydate, table, form;
//获取当前页码
var currPageNum = $(".layui-laypage-em").next().html();
//记录选中的学号
var data = null;
var index;
var loading;
var arr_status = ['未提交', '已提交'];
$(function () {
    layui.use(['layer', 'table', 'form', 'upload'], function () {
        layer = layui.layer,
            table = layui.table,
            form = layui.form;
        var upload = layui.upload;

        getTermList();
        getClassList();
        initTable();

        //文件上传
        upload.render({
            elem: '#importReplyScore', //绑定元素
            url: WebAPI.student + 'score/importReplyScore', //上传接口
            accept: 'file',
            acceptMime: '',
            exts: 'xls|excel|xlsx',
            before: function (obj) { //上传loading
                loading = layer.load(1, {
                    shade: [0.5, '#000'] //0.1透明度的背景
                });
            },
            done: function (res) {
                //上传完毕回调
                layer.close(loading);
                if (res.code == 200) {
                    layer.msg("导入成功");
                    reloadTable(1);
                } else {
                    layer.alert(res.msg)
                }
            },
            error: function () {
                //请求异常回调
                layer.msg("导入失败")
            },
        })
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
        });

        $("#clear").click(function () {
            $("input[name='name']").val('');
            $("input[name='username']").val('');
        })
        $("#updateReplyScore").click(function () {
            getCkecked();
            if (data == null) {
                layer.msg('请选择一行数据');
                return;
            } else if (data.all_status == 1) {
                layer.msg('该学生总成绩已提交,无法修改');
                return;
            } else {
                layer.confirm("确定修改该学生的答辩成绩吗？", {},
                    function (index, layero) {
                        layer.close(index);
                        openPrompt();
                    }
                );
            }
        });
        $("#term_id").change(function () {
            getPlanList();
        })
    })

    //按钮的监听
    $("#search").click(function () {
        reloadTable(1)
    });

})

//初始化表格
function initTable() {
    var json = getValue();
    table.render({
        elem: '#table',
        url: WebAPI.student + 'score/queryReplyByTea?term_id=' + json.term_id + '&classes=' + json.classes + '&username=' +
            json.username + '&name=' + json.name,
        page: true,
        id: 'tableReload',
        height: 'full-235',
        cols: [
            [{
                type: 'radio'
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
                {
                    field: 'reply_score',
                    title: '答辩成绩',
                    unresize: true,
                    align: 'center',
                    width: 100,
                    templet: function (d) {
                        if (d.reply_score == 0 || d.reply_score == null) {
                            d.reply_score = '-';
                        }
                        return d.reply_score
                    }
                },
				{
				    field: 'daily_score',
				    title: '平时成绩',
				    unresize: true,
				    align: 'center',
				    templet: function (d) {
				        if (d.daily_score == null) {
				            d.daily_score = '-';
				        }
				        return d.daily_score
				    }
				},
                {
                    field: 'all_status',
                    title: '综合成绩状态',
                    unresize: true,
                    align: 'center',
                    templet: function (d) {
                        return arr_status[d.all_status]
                    }
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
        url: WebAPI.student + 'score/queryReplyByTea?term_id=' + json.term_id + '&classes=' + json.classes + '&username=' +
            json.username + '&name=' + json.name,
        page: {
            curr: curr, //设置当前页面为第一页
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

//获取输入的内容
function getValue() {
    var json = {};
    json.term_id = $("select[name='id']").val();
    json.classes = $("select[name='classes']").val();
    json.username = $("input[name='username']").val();
    json.name = $("input[name='name']").val();
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

//打开输入弹框
function openPrompt() {
    layer.prompt({
        value: data.reply_score,
        title: '请输入答辩成绩',
    }, function (value, index, elem) {
        var re = /^\d+(?=\.{0,1}\d+$|$)/
        if (!re.test(value)) {
            layer.msg("请输入正确的数字");
            return;
        } else if (value > 100 || value < 0) {
            layer.msg("分数在0-100之间");
            return;
        }
        updateReplyScore(data.username, value, index)
    });
}

//添加答辩成绩
function updateReplyScore(username, score, index) {
    $.get(WebAPI.student + "score/updateReplyScore", {
        reply_score: score,
        username: username,
    }, function (data) {
        if (data.code == 200) {
            layer.alert('保存成功', function (i) {
                layer.close(index);
                layer.close(i)
                reloadTable(currPageNum)
            });
        } else {
            layer.msg(data.msg)
        }
    })
}

//获取选中的数据
function getCkecked() {
    data = null;
    var status = table.checkStatus("tableReload");
    $(status.data).each(function (index, obj) {
        data = obj;
    })
    console.log(data)
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
