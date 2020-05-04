var layer, laydate, table, form;
//获取当前页码
var currPageNum = $(".layui-laypage-em").next().html();
//记录选中的学号和实训成绩
var arr = [],
    data = [];
var loading;
$(function () {
    layui.use(['layer', 'table', 'form', 'upload'], function () {
        layer = layui.layer,
            table = layui.table,
            form = layui.form;
        var upload = layui.upload;

        //文件上传
        upload.render({
            elem: '#importTrainScore', //绑定元素
            url: WebAPI.student + 'score/importTrainScore', //上传接口
            accept: 'file',
            acceptMime: '',
            exts: 'xls|excel|xlsx',
            before: function (obj) { //上传loading
                loading = layer.load(1, {
                    shade: [0.5, '#000'] //0.1透明度的背景
                });
            },
            done: function (res) {
                layer.close(loading);
                //上传完毕回调
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

        getTermList();
        getClassList();
        inintTable();

        $("#clear").click(function () {
            $("input[name='name']").val('');
            $("input[name='username']").val('');
        })

        //监听复选框事件
        table.on('checkbox(table)', function (obj) {
            var d = obj.data;
            if (obj.checked) {
                arr.push(d.username);
                data.push(d)
            } else {
                for (var i = 0; i < arr.length; i++) {
                    if (d.username === arr[i]) {
                        arr.splice(i, 1);
                        data.splice(i, 1);
                    }
                }
            }
        });

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
        reloadTable()
    });
    $("#term_id").change(function () {
        getPlanList();
    })
    $("#submitAllScore").click(function () {
        if (arr.length == 0) {
            layer.msg('至少选择一行数据!');
            return;
        } else {
            //判断是否可以进行提交总成绩(答辩或实训成绩是否为空)
            //判断是否已经提交了总成绩
            var array = [],
                array2 = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].reply_score == null || data[i].reply_score == '' || data[i].train_score == null || data[i].train_score ==
                    '') {
                    array.push(data[i].username);
                }
                if (data[i].all_status == 1) {
                    array2.push(data[i].username);
                }
            }
            if (array.length > 0) {
                layer.alert("学号为" + array + "的学生答辩或实训报告成绩为空,无法提交总成绩");
                return;
            }
            if (array2.length > 0) {
                layer.alert("学号为" + array2 + "的学生已提交总成绩,不能重复提交");
                return;
            }
            layer.confirm("确定提交综合成绩吗？", {},
                //只有提交了总成绩才能显示总成绩
                function (index, layero) {
                    submitAllScore(arr)
                }
            );
        }

    });
    $("#updateTrainScore").click(function () {
        if (arr.length == 0) {
            layer.msg('请先选择一行数据!');
            return;
        } else if (arr.length > 1) {
            layer.msg('只能选择一行数据!');
            return;
        } else if (data[0].all_status == 1) {
            layer.msg('该学生总成绩已提交,无法修改');
            return;
        } else {
            layer.confirm("确定修改此学生的成绩吗？", {},
                function (index, layero) {
                    layer.close(index);
                    openPrompt();
                }
            );
        }
    });
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
                {
                    field: 'reply_score',
                    title: '答辩成绩',
                    unresize: true,
                    align: 'center',
                    templet: function (d) {
                        if (d.reply_score == 0 || d.reply_score == null) {
                            d.reply_score = '-';
                        }
                        return d.reply_score
                    }
                },
                {
                    field: 'train_score',
                    title: '实训报告成绩',
                    unresize: true,
                    align: 'center',
                    templet: function (d) {
                        if (d.train_score == 0 || d.train_score == null) {
                            d.train_score = '-';
                        }
                        return d.train_score
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
                    field: 'all_score',
                    title: '综合成绩',
                    unresize: true,
                    align: 'center',
                    templet: function (d) {
                        if (d.all_score == 0 || d.all_score == null || d.all_status == 0) {
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
    data = [];
    arr = [];
    var json = getValue();
    table.reload('tableReload', {
        url: WebAPI.student + 'score/queryReplyByTea?term_id=' + json.term_id + '&classes=' + json.classes + '&username=' +
            json.username + '&name=' + json.name,
        page: {
            curr: 1, //设置当前页面为第一页
        },
    }, 'data')
}

//提交综合成绩
function submitAllScore(arr) {
    var json = getValue();
    $.get(WebAPI.student + "score/submitAllScore", {
        arrStr: JSON.stringify(arr),
        term_id: json.term_id
    }, function (data) {
        if (data.code == 200) {
            layer.msg('提交成功');
            reloadTable(currPageNum)
        } else {
            layer.msg(data.msg)
        }
    })
}

//打开输入弹框
function openPrompt(v) {
    layer.prompt({
        value: data[0].train_score,
        title: '请输入实训报告成绩',
    }, function (value, index, elem) {
        var re = /^\d+(?=\.{0,1}\d+$|$)/
        if (!re.test(value)) {
            layer.msg("请输入正确的数字");
            return;
        } else if (value > 100 || value < 0) {
            layer.msg("分数在0-100之间");
            return;
        }
        updateTrainScore(value, index)
    });
}

//添加实训成绩
function updateTrainScore(score, index) {
    $.get(WebAPI.student + "score/updateTrainScore", {
        train_score: score,
        username: arr[0],
		train_id: $("#id").val()
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

//获取输入的值
function getValue() {
    var json = {};
    json.term_id = $("#id").val();
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
            layer.alert("查询计划编号发生错误");
        },
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
