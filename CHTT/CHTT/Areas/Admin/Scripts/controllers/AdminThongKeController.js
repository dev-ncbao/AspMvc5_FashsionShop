var AdminThongKe = {
    init: function () {
        AdminThongKe.registerEvents();
        AdminThongKe.loadData();
        setTimeout($('.nav-item')[8].classList.add('active'), 200);
    },
    registerEvents: function () {

        $('#btn-liet-ke').off('click').on('click', function () {
            AdminThongKe.loadDataWhenClick();
            AdminThongKe.registerEvents();
        });

    },
    loadDataWhenClick: function () {
        var dateType = $('#ddl-day-control');
        var date = $('#ip-day-control');
        var tbc = $('#total-bill-count');
        var ts = $('#total-sales');
        $.ajax({
            url: '/quan-ly/AdminThongKe/GetReport',
            dataType: 'json',
            type: 'GET',
            data: {
                dateType: dateType.val(),
                date: date.val()
            },
            success: function (response) {
                if (response.status && response.total.DoanhThu != null && response.products.length != 0) {
                    tbc.html('Tổng số hóa đơn: ' + response.total.SoHoaDon);
                    ts.html('Tổng doanh thu: ' + Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(response.total.DoanhThu));

                    $('#report-list-product p').remove();
                    $('#report-list-product table tbody').empty();
                    $.each(response.products, function (i, item) {
                        $('#report-list-product table tbody').append('<tr>' +
                            '<td>' + (i + 1) + '</td>' +
                            '<td>' + item.MaSP + '</td>' +
                            '<td>' + item.TenSP + '</td>' +
                            '<td>x' + item.SoLuong + '</td>' +
                            '<td>' + item.Size + '</td>' +
                            '<td>' + Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(item.Gia) + '</td>' +
                            '</tr >');
                    });
                }
                else {
                    tbc.html('Tổng số hóa đơn: Chưa có dữ liệu');
                    ts.html('Tổng doanh thu: Chưa có dữ liệu');
                    $('#report-list-product table tbody').empty();
                    if ($('#report-list-product p').length == 0) {
                        $('#report-list-product').append('<p>Chưa có dữ liệu</p>');
                    }
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi kết nối với Server', {
                    style: 'myNotify',
                    globalPosition: 'top right',
                    className:'noti-danger'
                });
            }
        });
    },
    loadData: function () {
        var date = new Date();
        var day = date.getDate().toString();
        var month = (date.getMonth() + 1).toString();
        var strDate = date.getFullYear().toString() + '-' + (month.length == 2 ? month : ('0' + month)) + '-' + (day.length == 2 ? day : ('0' + day));
        $('#ip-day-control').val(strDate);

        AdminThongKe.loadDataWhenClick();
    }
}

AdminThongKe.init();