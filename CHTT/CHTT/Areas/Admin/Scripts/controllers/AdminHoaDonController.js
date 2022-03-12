var dataTable;
var HoaDonController = {
    init: function () {
        HoaDonController.loadIndexData();
        HoaDonController.registerEvents();
        setTimeout($('.nav-item')[4].classList.add('active'), 200);
    },
    registerEvents: function () {
        $(document).off('click', '.edit-button').on('click', '.edit-button', function () {
            var strMaHD = $(this).data('id');
            location.href = '/quan-ly/hoa-don/chi-tiet/?strMaHD=' + strMaHD;
        });
    },
    loadIndexData: function () {
        dataTable = $('#HDTable').DataTable({
            ajax: {
                url: '/quan-ly/hoa-don/LoadIndexData',
                type: 'GET',
                datatype: 'json'
            },
            columns: [
                { data: 'MaHD' },
                { data: 'HoTenKH' },
                {
                    data: 'NgayXuatHD',
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
                    data: 'TongSoLuong',
                    render: function (data) {
                        return data + ' cái';
                    }
                },
                {
                    data: 'TongGiaTri',
                    render: function (data) {
                        return Intl.NumberFormat('it-IT', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(data);
                    }
                },
                {
                    data: 'MaDD'
                },
                {
                    data: 'MaHD',
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
            "pagingType": "full_numbers"
        });

        document.getElementsByClassName('action-col')[0].classList.remove('action-col');
    }
}


$(document).ready(function () {
    HoaDonController.init();
});

