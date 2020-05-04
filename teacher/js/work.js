var layer, table, form;
//获取当前页码
var index1;
var term_id,parentData={};
var currPageNum = $(".layui-laypage-em").next().html();
$(function () {
    layui.use(['layer', 'table', 'form'], function () {
		layer=layui.layer;
		table=layui.table;
		form=layui.form
		
		getTermList();
		inintTable();
		toolbarListen();
		
	})
	
	$("#term_id").change(function () {
		term_id=$("#term_id").val();
	    getPlanList();
	})
	$("#open").click(function(){
		index1 = layer.open({
		    type: 2,
		    btn: false,
		    area: ['60%', '55%'],
		    title: ['作业发布', '15px'],
		    content: '../html/addWork.html'
		})
	})
	$("#search").click(function () {
	    reloadTable()
	});
	
})
//初始化表格
function inintTable() {
    var plan_id=$("select[name='id']").val();
    table.render({
        elem: '#table',
        url: WebAPI.teacher + 'work/getList?plan_id=' + plan_id,
        page: true,
        id: 'tableReload',
        height: 'full-235',
        cols: [
            [
                {field: 'id', title: 'id', hide: true},
                {
                    field: 'plan_id',
                    title: '实训名称',
                    unresize: true,
                    align: 'center'
                },
                {
                    field: 'question',
                    title: '作业题目',
                    unresize: true,
                    align: 'center'
                }, {
                    fixed: 'right',
                    title: '操作',
                    toolbar: '#oper-col',
                    align: 'center'
                }
                
            ]
        ],
    })
}

//搜索时重载表格
function reloadTable() {
    var plan_id=$("select[name='id']").val();
    table.reload('tableReload', {
        url: WebAPI.teacher + 'work/getList?plan_id=' + plan_id,
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
			term_id= $("#term_id").val();
        },
        error: function () {
            layer.alert("查询计划编号发生错误");
        },
    })
    getPlanList()
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
//监听工具条
function toolbarListen() {
    table.on('tool(table)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
		parentData.id=data.id;
        if (layEvent === 'open') {
            layer.open({
                type: 2,
                btn: false,
                area: ['60%', '75%'],
                title: ['答题详情', '15px'],
                content: '../html/answerDetail.html'
            })
        }
    })
}
