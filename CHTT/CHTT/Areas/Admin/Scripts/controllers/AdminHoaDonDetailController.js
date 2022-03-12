var HoaDonDetailController = {

    init: function () {
        HoaDonDetailController.loadDataTable();
        setTimeout($('.nav-item')[4].classList.add('active'), 200);
        $('#tg-control').val(Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format($('#tg-control').val()));
    },
    loadDataTable: function() {
        $('#CTHDTable').DataTable({
            ajax: {
                url: '/quan-ly/don-dat/LoadTableData',
                type: 'GET',
                dataType: 'json',
                data: {
                    strMaDD: $('#mdd-control').val()
                }
            },
            columns: [
                {
                    data: 'MaSP'
                },
                {
                    data: 'Link',
                    render: function (data) {
                        if (data != null) {
                            return '<img src="' + data + '" class="picture-represent-column"/>'
                        }
                        else return "Chưa có";
                    }
                },
                {
                    data: 'TenSP'
                },
                {
                    data: 'SoLuong',
                    render: function (data) {
                        return data + ' cái'
                    }
                },
                {
                    data: 'Size'
                },
                {
                    data: 'Gia',
                    render: function (data) {
                        return Intl.NumberFormat('it-IT', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(data);
                    }
                }
            ],
            "lengthMenu": [[-1], ["Tất cả"]],
            "language": {
                "sInfoFiltered": "",
                "sInfoEmpty": "",
                "sInfo": "Tổng số _TOTAL_ dòng",
                "sEmptyTable": "Không có dữ liệu",
                "sLengthMenu": "",
                "sSearch": "",
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
            searching: false
        });
    }
}

$(document).ready(function () {
    HoaDonDetailController.init();
});
 
