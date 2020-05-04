var layer, laydate, table, form,index;
var addFlag=true;
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

        getTermList();
        inintTable();


        //监听复选框事件
        table.on('checkbox(table)', function (obj) {
            var d = obj.data;
            if (obj.checked) {
                arr.push(d.r_id);
                data.push(d)
            } else {
                for (var i = 0; i < arr.length; i++) {
                    if (d.r_id === arr[i]) {
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
    
   $("#addInfo").click(function () {
	   addFlag=true;
       index = layer.open({
       	type: 2,
       	btn: false,
       	area: ['450px', '380px'],
       	title: ['添成绩比例', '15px'],
       	content: 'updateRatio.html'
       })
   });
    $("#updateInfo").click(function () {
		addFlag=false;
        if (arr.length == 0) {
            layer.msg('请先选择一行数据!');
            return;
        } else if (arr.length > 1) {
            layer.msg('只能选择一行数据!');
            return;
        } else{
			index = layer.open({
				type: 2,
				btn: false,
				area: ['450px', '380px'],
				title: ['修改成绩比例', '15px'],
				content: 'updateRatio.html'
			})
		}
    });
})

//初始化表格
function inintTable() {
    var json = getValue();
    table.render({
        elem: '#table',
        url: WebAPI.manage + 'ratio/getListByAdmin?term_id=' + json.term_id +
                '&train_name=' + json.train_name,
        page: true,
        id: 'tableReload',
        cols: [
            [{
                type: 'checkbox'
            },
                {
                    field: 'r_id',
                    title: 'id',
                   hide: true
                },
                {
                    field: 'term_id',
                    title: '学期',
                    unresize: true,
                    align: 'center'
                },
                {
                    field: 'name',
                    title: '实训名称',
                    unresize: true,
                    align: 'center',
                },
                {
                    field: 'r1',
                    title: '答辩成绩比例',
                    unresize: true,
                    align: 'center',
                },
                {
                    field: 'r2',
                    title: '实训报告成绩',
                    unresize: true,
                    align: 'center',
                },
                {
                    field: 'r3',
                    title: '平时成绩比例',
                    unresize: true,
                    align: 'center',
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
        url:  WebAPI.manage + 'ratio/getListByAdmin?term_id=' + json.term_id +
                '&train_name=' + json.train_name,
        page: {
            curr: 1, //设置当前页面为第一页
        },
    }, 'data')
}



//获取输入的值
function getValue() {
    var json = {};
    json.term_id = $("#term_id").val();
    json.train_name = $("input[name='train_name']").val();
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
}



