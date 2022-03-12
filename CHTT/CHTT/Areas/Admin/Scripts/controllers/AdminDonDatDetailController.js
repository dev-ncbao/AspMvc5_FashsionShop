var dataTable;
var CTDDController = {
    init: function () {
        CTDDController.loadTableData();
        $('#mdd-control').val(strMaDD);
        CTDDController.getDetailAdditionalData();
        setTimeout(CTDDController.getTotalMoney, 100);
        CTDDController.disableControl();
        CTDDController.registerEvents();
        setTimeout($('.nav-item')[3].classList.add('active'), 200);
    },
    registerEvents: function () {
        $(document).off('click', '.edit-button').on('click', '.edit-button', function () {
            var strMaSP = $(this).data('id');
            var strSize = $(this).data('size');
            var SoLuong = $(this).data('sl');
            CTDDController.getSizeOfProduct(strMaSP,strSize);
            $('#msp-control').val(strMaSP);
            $('#size-control').val(strSize);
            $('#sl-control').val(SoLuong);
            $('#aoe-modal').modal('show');
            CTDDController.registerEvents();
        });

        $(document).off('click', '.delete-button').on('click', '.delete-button', function () {
            if (confirm('Bạn muốn xóa sản phẩm này khỏi đơn?')) {
                var strMaSP = $(this).data('id');
                var strSize = $(this).data('size');
                var strMaDD = $('#mdd-control').val();
                CTDDController.deleteProduct(strMaSP, strSize,strMaDD);
            }
            CTDDController.registerEvents();
        });

        $(document).off('click', '.close').on('click', '.close', function () {
            $('#aoe-modal').modal('hide');
            CTDDController.registerEvents();
        });

        $('#save-button').off('click').on('click', function () {
            CTDDController.submitUpdateDetailInformation();
            CTDDController.registerEvents();
        });

        $('#btn-confirm-dd').off('click').on('click', function () {
            if (confirm('Xác nhận đã xử lý đơn hàng và xuất hóa đơn?')) {
                CTDDController.confirmOrder();
                setTimeout(function () {
                    CTDDController.getMaHD();
                },1000);
            }
            CTDDController.registerEvents();
        });

        $('#btn-redirect-dd').off('click').on('click', function () {
            var strMaHD = $(this).data('id');
            location.href = '/quan-ly/hoa-don/chi-tiet/?strMaHD=' + strMaHD;
        });

        $('#btn-cancel-dd').off('click').on('click', function () {
            if (confirm('Bạn muốn hủy đơn hàng này?')) {
                CTDDController.cancelOrder();
            }
            CTDDController.registerEvents();
        });
    },
    getMaHD: function () {
        $.ajax({
            url: '/quan-ly/don-dat/GetMaHD',
            dataType: 'json',
            type: 'GET',
            data: {
                strMaDD: $('#mdd-control').val()
            },
            success: function (response) {
                if (response.status) {
                    $('#btn-redirect-dd').data('id', response.data);
                }
                else {
                    $.notify('Đã xảy ra lỗi', {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-danger'
                    });
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi kết nối tới Server khi lấy mã hóa đơn', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    disableControl: function () {
        $('#gc-control').prop('disabled', true).addClass('disabled-background');
        $('#thanhtien-control').prop('disabled', true).addClass('disabled-background');
        $('#trangthai-control').prop('disabled', true).addClass('disabled-background');
        $('#ngaydat-control').prop('disabled', true).addClass('disabled-background');
        $('#mdd-control').prop('disabled', true).addClass('disabled-background');
        $('#email-control').prop('disabled', true).addClass('disabled-background');
        $('#mkh-control').prop('disabled', true).addClass('disabled-background');
        $('#sdt-control').prop('disabled', true).addClass('disabled-background');
        $('#gt-control').prop('disabled', true).addClass('disabled-background');
        $('#hoten-control').prop('disabled', true).addClass('disabled-background');
    },
    confirmOrder: function () {
        var strMaDD = $('#mdd-control').val();
        var strMaKH = $('#mkh-control').val();
        var strGhiChu = $('#gc-control').val();

        model = {
            MaDD: strMaDD,
            MaKH: strMaKH,
            GhiChu: strGhiChu
        };

        var HDCT = new Array();
        dataTable.column().data().each(function (v, i) {
            HDCT.push({
                MaSP:dataTable.row(i).data().MaSP,
                SoLuong:dataTable.row(i).data().SoLuong,
                Gia:dataTable.row(i).data().Gia,
                Size:dataTable.row(i).data().Size
            });
        });
        
        $.ajax({
            url: '/quan-ly/don-dat/ConfirmOrder',
            type: 'POST',
            dataType: 'json',
            data: {
                model: model,
                listDetail: HDCT
            },
            success: function (response) {
                if (response.status) {
                    $('#btn-cancel-dd').css('display', 'none');
                    $('#btn-confirm-dd').css('display', 'none');
                    $('#btn-redirect-dd').css('display', 'block');
                    $.notify(response.message, {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-success'
                    });
                }
                else {
                    $.notify(response.message, {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-danger'
                    });
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi kết nối Server', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    cancelOrder: function () {
        var strMaDD = $('#mdd-control').val();
        $.ajax({
            url: '/quan-ly/don-dat/CancelOrder',
            type: 'POST',
            dataType: 'json',
            data: {
                strMaDD: strMaDD
            },
            success: function (response) {
                if (response.status) {
                    $('#btn-cancel-dd').css('display', 'none');
                    $('#btn-confirm-dd').css('display', 'none');
                    $('#btn-redirect-dd').css('display', 'block');
                    $.notify(response.message, {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-success'
                    });
                }
                else {
                    $.notify(response.message, {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-danger'
                    });
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi kết nối Server', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    getSizeOfProduct: function (strMaSP,strSize) {
        $.ajax({
            url: '/quan-ly/don-dat/GetSizeOfProduct',
            type: 'GET',
            dataTable:'json',
            data: {
                strMaSP: strMaSP
            },
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    $('#size-control option').remove();
                    $.each(data, function (i, item) {
                        $('#size-control').append('<option value='+item+'>' + item + '</option>')
                    });
                    $('#size-control').val(strSize);
                }
                else {
                    $.notify('Đã xảy ra lỗi lấy dữ liệu từ Server', {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-danger'
                    });
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi kết nối Server', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    deleteProduct: function (strMaSP, strSize, strMaDD) {
        var model = {
            MaSP: strMaSP,
            Size: strSize,
            MaDD: strMaDD
        }

        $.ajax({
            url: '/quan-ly/don-dat/DeleteProduct',
            type: 'POST',
            dataType: 'json',
            data: {
                model: model
            },
            success: function (response) {
                if (response.status) {
                    dataTable.ajax.reload(null, false);
                    setTimeout(CTDDController.getTotalMoney, 100);
                    $.notify(response.message, {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-success'
                    });
                }
                else {
                    $.notify(response.message, {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-danger'
                    });
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi kết nối Server', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    submitUpdateDetailInformation: function () {
        var model = {
            MaSP: $('#msp-control').val(),
            Size: $('#size-control').val(),
            SoLuong: $('#sl-control').val(),
            MaDD: $('#mdd-control').val()
        }

        $.ajax({
            url: '/quan-ly/don-dat/UpdateDetailInformation',
            type: 'POST',
            dataType: 'json',
            data: {
                model: model
            },
            success: function (response) {
                if (response.status) {
                    dataTable.ajax.reload(null, false);
                    $('#aoe-modal').modal('hide');
                    setTimeout(CTDDController.getTotalMoney, 100);
                    $.notify(response.message, {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-success'
                    });
                }
                else {
                    $.notify(response.message, {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-danger'
                    });
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi kết nối Server', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    disableEditProduct: function () {
        $.each($('.edit-button'), function (i, item) {
            $(this).addClass('disabled').prop('disabled',true);
        });
        $.each($('.delete-button'), function (i, item) {
            $(this).addClass('disabled').prop('disabled', true);
        });
    },
    getDetailAdditionalData: function () {
        
            $.ajax({
                url: '/quan-ly/don-dat/DetailAdditionalData',
                type: 'GET',
                dataType: 'json',
                data: {
                    strMaDD: $('#mdd-control').val()
                },
                success: function (response) {
                    if (response.status) {
                        var data = response.data;
                        $('#gc-control').val(data.GhiChu);
                        $('#trangthai-control').val(data.TrangThai != 0 ? (data.TrangThai == 1 ? 'Đã xử lý' : 'Đã hủy') : 'Chưa xử lý');
                        if (data.TrangThai == 0) {
                            $('#btn-cancel-dd').css('display', 'block');
                            $('#btn-confirm-dd').css('display', 'block');
                        }
                        else if (data.TrangThai == 1) {
                            $('#btn-redirect-dd').css('display', 'block');
                            CTDDController.getMaHD();
                            CTDDController.disableEditProduct();
                        }
                        else {
                            CTDDController.disableEditProduct();
                        }
                        var date = new Date(parseInt(data.NgayDat.substring(6).replace(')/', '')));
                        var day = date.getDate().toString();
                        var month = (date.getMonth() + 1).toString();
                        var strDate = (day.length == 2 ? day : ('0' + day)) + '/' + (month.length == 2 ? month : ('0' + month)) + '/' + date.getFullYear().toString();
                        var hour = date.getHours().toString();
                        var minute = date.getMinutes().toString();
                        var second = date.getSeconds().toString();
                        strDate += "\t\t" + (hour.length == 2 ? hour : ('0') + hour) + ":" + (minute.length == 2 ? minute : ('0') + minute) + ":" + (second.length == 2 ? second : ('0') + second) + "";
                        $('#ngaydat-control').val(strDate);
                    }
                    else {
                        $.notify('Đã xảy ra lỗi lấy dữ liệu từ Server', {
                            globalPosition: 'top right',
                            style: 'myNotify',
                            className: 'noti-danger'
                        });
                    }
                },
                error: function () {
                    $.notify('Đã xảy ra lỗi kết nối Server', {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-danger'
                    });
                }
            });

    },
    getTotalMoney: function () {
        var total = 0;
        dataTable.column(5).data().each(function (value, index) {
            total += value * dataTable.column(3).data()[index];
        });
        $('#thanhtien-control').val(Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'VND'
        }).format(total));
    },
    loadTableData: function () {
        dataTable = $('#CTDDTable').DataTable({
            ajax: {
                url: '/quan-ly/don-dat/LoadTableData',
                type: 'GET',
                dataType: 'json',
                data: {
                    strMaDD: strMaDD
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
                },
                {
                    data: 'MaSP',
                    width: '174px',
                    /*render: function (data) {
                        return "<button class='btn btn-primary edit-button'  data-id='" + data + "' data-size='" + row[4] + "'><i class='fa fa-wrench' style='margin-right:.3rem' aria-hidden='true'></i>Sửa</button><button class='btn btn-danger delete-button' data-id='" + data + "' data-size='" + row[4] +"'><i class='fa fa-trash' style='margin-right:.3rem' aria-hidden='true'></i>Xóa</button>";
                    },*/
                    className: 'action-col',
                    sortable: false
                }
            ],
            "columnDefs": [
                {
                    // The `data` parameter refers to the data for the cell (defined by the
                    // `data` option, which defaults to the column being worked with, in
                    // this case `data: 0`.
                    "render": function (data, type, row) {
                        return "<button class='btn btn-primary edit-button'  data-id='" + data + "' data-size='" + row.Size + "' data-sl='" + row.SoLuong + "'><i class='fa fa-wrench' style='margin-right:.3rem' aria-hidden='true'></i>Sửa</button><button class='btn btn-danger delete-button' data-id='" + data + "' data-size='" + row.Size + "'><i class='fa fa-trash' style='margin-right:.3rem' aria-hidden='true'></i>Xóa</button>";
                    },
                    "targets": 6
                }
            ],
            "lengthMenu": [[20, -1], [20, "Tất cả"]],
            "language": {
                "sInfoFiltered": "",
                "sInfoEmpty": "",
                "sInfo": "Tổng số _TOTAL_ dòng",
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
        });
        document.getElementsByClassName('action-col')[0].classList.remove('action-col');
    }
}

$(document).ready(function () {
    CTDDController.init();
});