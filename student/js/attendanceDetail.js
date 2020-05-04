//获取当前页码
var currPageNum = $(".layui-laypage-em").next().html();
var json = window.parent.data;
var username = window.parent.username;
var total = window.parent.total;
var count = 0;
$(function () {
    layui.use('laypage', function () {
        var laypage = layui.laypage;

        $("#count").text(total)
        getOneAttend(1, 5);

        //自定义分页
        laypage.render({
            elem: 'page',
            count: count, //数据总数，从服务端得到
            groups: 3,
            limit: 5, //每页条数
            limits: [5, 10, 20, 50], //分页选择
            curr: location.hash.replace('#!fenye=', ''), //获取起始页
            layout: ['count', 'limit', 'prev', 'page', 'next'], //自定义排版
            jump: function (obj, first) { //切换分页,obj包含了当前分页的所有参数，
                //首次不执行
                if (!first) {
                    getOneAttend(obj.curr, obj.limit)
                }
            }
        })
    })
})

//分析考勤
function getOneAttend(curr, limit) {
    $.ajax({
        url: WebAPI.engineer + 'attend/tableAnalysis',
        type: 'get',
        async: false,
        data: {
            username: username,
            times: json.times,
            term_id: json.term_id,
            page: curr,
            limit: limit,
        },
        success: function (data) {
            count = data.count;
            var tr = '';
            for (var i = 0; i < data.data.length; i++) {
                tr += '<tr><td><img src="../img/img.png"></td><td>' + data.data[i].time +
                    '</td><td>' + data.data[i].count + '</td></tr>';
            }
            $('table tbody').html(tr);
        },
        error: function (err) {
            console.log(err)
        },
    })
}