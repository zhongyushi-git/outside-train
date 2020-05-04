var layer, table, form;
//获取当前页码
var index1;
var term_id;
var user =JSON.parse(decodeURIComponent(atob(sessionStorage.getItem("user"))));
var username = user.username
var currPageNum = $(".layui-laypage-em").next().html();
var parentData={};
parentData.username=user.username;
$(function () {
    layui.use(['layer', 'table', 'form'], function () {
		layer=layui.layer;
		table=layui.table;
		form=layui.form
		
		inintTable();
		toolbarListen();
		
	})
	
	$("#term_id").change(function () {
		term_id=$("#term_id").val();
	    getPlanList();
	})
	
	$("#search").click(function () {
	    reloadTable()
	});
	
})
//初始化表格
function inintTable() {
    table.render({
        elem: '#table',
        url: WebAPI.teacher + 'work/getListByStu?username='+username,
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
                }, 
				{
				    field: 'answer',
				    title: '完成状态',
				    unresize: true,
				    align: 'center'
				},{
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
        url: WebAPI.teacher + 'work/getListByStu?username='+username,
        page: {
            curr: 1, //设置当前页面为第一页
        },
    }, 'data')
}


//监听工具条
function toolbarListen() {
    table.on('tool(table)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
		parentData.q_id=data.id;
		parentData.question=data.question;
		if(data.answer=='已完成'){
			layer.msg("此作业已完成，不能重复答题");
			return;
		}
        if (layEvent === 'open') {
            index1=layer.open({
                type: 2,
                btn: false,
                area: ['60%', '80%'],
                title: ['答题', '15px'],
                content: '../html/addAnswer.html'
            })
        }
    })
}
