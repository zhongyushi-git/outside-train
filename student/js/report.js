var layer, laydate, table, form, upload;
//获取当前页码
var currPageNum = $(".layui-laypage-em").next().html();
var username = loginUser.username
var termId;
$(function() {

	layui.use(['layer', 'laydate', 'table', 'form', 'upload'], function() {
		layer = layui.layer,
			table = layui.table,
			form = layui.form;
		upload = layui.upload;

		getTermList();
		var term_id = $("#term_id").val()
		uploadFile(term_id)
		inintTable();

	})
	//搜索监听
	$("#search").click(function() {
		reloadTable();
	});


})

function uploadFile(val) {
	upload.render({
		elem: '#upload',
		url: WebAPI.teacher + 'report/upload?term_id=' + val + '&username=' + username,
		/*规定打开文件选择框时，筛选出的文件类型*/
		accept: 'file', //普通文件
		/*允许上传的文件后缀*/
		exts: 'doc|docx|ppt|pptx|pdf',
		/*设置文件最大可允许上传的大小*/
		size: 1024 * 30,
		done: function(res) {
			layer.msg('上传成功');
			reloadTable();
		},
		error: function() {
			/*请求异常回调*/
			layer.msg("上传文件不能超过30M");
		}
	});
}
//初始化表格
function inintTable() {
	var term_id = $("#term_id").val()
	table.render({
		elem: '#table',
		url: WebAPI.teacher + 'report/getList?term_id=' + term_id + '&username=' + username,
		page: true,
		id: 'tableReload',
		height: 'full-200',
		cols: [
			[{
					field: 'file_id',
					title: 'ID',
					hide: true
				},
				{
					field: 'old_name',
					title: '文件名',
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
					field: 'size',
					title: '文件大小(KB)',
					unresize: true,
					align: 'center',
				},
				{
					field: 'time',
					title: '上传时间',
					unresize: true,
					align: 'center',
				}
			]
		],
	})
}

//搜索时重载表格
function reloadTable() {
	var term_id = $("#term_id").val()
	table.reload('tableReload', {
		url: WebAPI.teacher + 'report/getList?term_id=' + term_id + '&username=' + username,
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
		success: function(data) {
			$("#term_id").html('');
			var select = '';
			for (var i = 0; i < data.length; i++) {
				termId = data[0].term_id
				select += '<option value="' + data[i].term_id + '">' + data[i].term + '</option>';
			}
			$("#term_id").append(select);
		},
		error: function() {
			layer.alert("查询学期信息发生错误");
		}
	})
}
