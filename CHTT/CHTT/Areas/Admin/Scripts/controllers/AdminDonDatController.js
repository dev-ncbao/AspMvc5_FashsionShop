var dataTable;
var DonDatController = {
    init: function () {
        DonDatController.loadIndexData();
        DonDatController.registerEvents();
        setTimeout($('.nav-item')[3].classList.add('active'), 200);
    },
    registerEvents: function () {
        $(document).off('click', '.edit-button').on('click', '.edit-button', function () {
            var strMaDD = $(this).data('id');
            location.href = '/quan-ly/don-dat/chi-tiet/?strMaDD=' +strMaDD;
        });
    },
    loadIndexData: function () {
        dataTable = $('#DDTable').DataTable({
            ajax: {
                url: '/quan-ly/don-dat/LoadIndexData',
                type: 'GET',
                datatype: 'json'
            },
            columns: [
                { data: 'MaDD' },
                { data: 'HoTenKH' },
                {
                    data: 'NgayDat',
                    render: function (data) {
                        var date = new Date(parseInt(data.substring(6).replace(')/', '')));
                        var day = date.getDate().toString();
                        var month = (date.getMonth() + 1).toString();
                        var strDate = (day.length == 2 ? day : ('0' + day)) + '/' + (month.length == 2 ? month : ('0' + month)) + '/' + date.getFullYear().toString();
                        var hour = date.getHours().toString();
                        var minute = date.getMinutes().toString();
                        var second = date.getSeconds().toString();
                        strDate += "&nbsp;&nbsp;&nbsp;&nbsp;" + (hour.length == 2 ? hour : ('0') + hour) + ":" + (minute.length == 2 ? minute : ('0') + minute) + ":" + (second.length == 2 ? second : ('0') + second) + "";
                        return strDate;
                    }
                },
                {
                    data: 'TongSoLuong'
                },
                {
                    data: 'TrangThai',
                    render: function (data) {
                        if (data == 0) {
                            return 'Chưa xử lý';
                        }
                        else if (data == 2) {
                            return 'Đã hủy';
                        }
                        else return 'Đã xử lý';
                    }
                },
                {
                    data: 'MaDD',
                    width: '114px',
                    render: function (data) {
                        return "<button class='btn btn-primary edit-button'  data-id='" + data + "'><i class='fa fa-wrench' style='margin-right:.3rem' aria-hidden='true'></i>Chi tiết</button>";
                    },
                    className: 'action-col',
                    sortable: false
                }
            ],
            "lengthMenu": [[20, -1], [20, "Tất cả"]],
            "language": {
                "sInfoFiltered": "",
                "sInfoEmpty": "",
                "sInfo": "Tổng số _TOTAL_ đơn",
                "sEmptyTable": "Không có dữ liệu",
                "sLengthMenu": "Hiển thị  _MENU_ dòng/ Trang",
                "sSearch": "Tìm kiếm: ",
                "sZeroRecords": "Không tìm thấy thông tin",
                "sLoadingRecords": "Đang tải...",
                "paginate": {
                    "next": '<i class="fa fa-angle-right" aria-hidden="true"></i>',
                    "previous": '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                    "first": '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
                    "last": '<i class="fa fa-angle-double-right" aria-hidden="true"></i>'
                }
            },
            "pagingType": "full_numbers",
             order: [[4, 'asc']]
        });

        document.getElementsByClassName('action-col')[0].classList.remove('action-col');
    }
}


$(document).ready(function () {
    DonDatController.init();
});

