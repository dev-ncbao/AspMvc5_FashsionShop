var dataTable;
var isAdd;
var PhieuNhapController = {
    init: function () {
        PhieuNhapController.LoadIndexData();
        PhieuNhapController.registerEvents();
        setTimeout($('.nav-item')[5].classList.add('active'), 200);
    },
    registerEvents: function () {
        $('#btn-add-pn').off('click').on('click', function () {
            $('.modal-title').empty().append('THÊM PHIẾU MỚI');
            PhieuNhapController.getNextPNID();
            PhieuNhapController.resetAOEForm();
            isAdd = true;
            $('#aoe-modal').modal('show');
        });

        $('#save-button').off('click').on('click', function () {
            if (PhieuNhapController.validationAOEForm()) {
                PhieuNhapController.submitAOEForm(isAdd);
            }
            else {
                $.notify('Vui lòng kiểm tra lại thông tin', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
            PhieuNhapController.registerEvents();
        });

        $('#reset-button').off('click').on('click', function () {
            PhieuNhapController.resetAOEForm();
            PhieuNhapController.registerEvents();
        });

        $(document).off('click', '#close-modal').on('click', '#close-modal', function () {
            $('#aoe-modal').modal('hide');
            PhieuNhapController.registerEvents();
        });

        $(document).off('click', '.delete-button').on('click', '.delete-button', function () {
            var MaPN = $(this).data('id');
            if (confirm("Bạn muốn xóa phiếu " + MaPN + "?")) {
                PhieuNhapController.deletePN(MaPN);
            }
            PhieuNhapController.registerEvents();
        });

        $(document).off('click', '.edit-button').on('click', '.edit-button', function () {
            var MaPN = $(this).data('id');
            location.href = '/quan-ly/phieu-nhap/chi-tiet/?strMaPN=' + MaPN;
        });
    },
    deletePN: function (strMaPN) {
        $.ajax({
            url: '/quan-ly/AdminPhieuNhap/Delete',
            type: 'POST',
            dataType: 'json',
            data: {
                strMaPN: strMaPN
            },
            success: function (response) {
                if (response.status) {
                    dataTable.ajax.reload(null, false);
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
                $.notify('Đã xảy ra lỗi', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    submitAOEForm: function (isAdd) {
        var MaPN = $('#mpn-control');
        var NCC = $('#ncc-control');
        var NgayNhap = $('#ngaynhap-control');
        model = {
            MaPN: MaPN.val(),
            MaNCC: NCC.val(),
            NgayNhap: NgayNhap.val()
        }
        var strMaPN = MaPN.val();
        $.ajax({
            url: '/quan-ly/AdminPhieuNhap/AddOrEdit',
            type: 'POST',
            dataType: 'json',
            data: {
                model: model,
                isAdd: isAdd
            },
            success: function (response) {
                if (response.status) {
                    dataTable.ajax.reload(null, false);
                    $('#aoe-modal').modal('hide');
                    if (confirm('Bạn có muốn nhập thông tin chi tiết cho phiếu này không?')) {
                        location.href = '/quan-ly/AdminPhieuNhap/Detail/?strMaPN=' + strMaPN;
                    }
                    else {
                        $.notify(response.message, {
                            globalPosition: 'top right',
                            style: 'myNotify',
                            className: 'noti-success'
                        });
                        $('#aoe-modal').modal('hide');
                    }
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
                $.notify('Đã xảy ra lỗi', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    validationAOEForm: function () {
        var MaPN = $('#mpn-control');
        var NCC = $('#ncc-control');
        var NgayNhap = $('#ngaynhap-control');

        MaPN.val(MaPN.val().trim());
        if (MaPN.val().length == 0) {
            MaPN.addClass('input-danger-outline');
            MaPN.removeClass('input-success-outline');
        }
        else {
            MaPN.addClass('input-success-outline');
            MaPN.removeClass('input-danger-outline');
        }

        if (NCC.val().length == 0) {
            NCC.addClass('input-danger-outline');
            NCC.removeClass('input-success-outline');
        }
        else {
            NCC.addClass('input-success-outline');
            NCC.removeClass('input-danger-outline');
        }

        if (NgayNhap.val().length == 0 || new Date(NgayNhap.val()) > new Date()) {
            NgayNhap.addClass('input-danger-outline');
            NgayNhap.removeClass('input-success-outline');
        }
        else {
            NgayNhap.addClass('input-success-outline');
            NgayNhap.removeClass('input-danger-outline');
        }

        if (MaPN.hasClass('input-success-outline') &&
            NCC.hasClass('input-success-outline') &&
            NgayNhap.hasClass('input-success-outline')) {
            return true;
        }
        else return false;
    },
    resetAOEForm: function () {
        var NCC = $('#ncc-control');
        var MaPN = $('#mpn-control');
        var NgayNhap = $('#ngaynhap-control');

        NCC.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
        MaPN.removeClass('input-success-outline').removeClass('input-danger-outline');
        NgayNhap.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
    },
    getNextPNID: function () {
        $.ajax({
            url: '/quan-ly/AdminPhieuNhap/GetNextPNID',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#mpn-control').val(response.strMaPN);
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
    LoadIndexData: function () {
        dataTable = $('#PNTable').DataTable({
            ajax: {
                url: '/quan-ly/AdminPhieuNhap/LoadIndexData',
                type: 'GET',
                dataType:'json'
            },
            columns: [
                {
                    data:'MaPN'
                },
                {
                    data: 'TenNCC'
                },
                {
                    data: 'NgayNhap',
                    render: function (data) {
                        var date = new Date(parseInt(data.substring(6).replace(')/', '')));
                        var day = date.getDate().toString();
                        var month = (date.getMonth() + 1).toString();
                        var strDate =  (day.length == 2 ? day : ('0' + day))+ '/' + (month.length == 2 ? month : ('0' + month)) + '/' + date.getFullYear().toString();
                        var hour = date.getHours().toString();
                        var minute = date.getMinutes().toString();
                        var second = date.getSeconds().toString();
                        strDate += "&nbsp;&nbsp;&nbsp;&nbsp;" + (hour.length == 2 ? hour : ('0') + hour) + ":" + (minute.length == 2 ? minute : ('0') + minute) + ":" + (second.length == 2 ? second : ('0') + second) + "";
                        return strDate;
                    }
                },
                {
                    data: 'SLTH',
                    render: function (data) {
                        return data+' sản phẩm'
                    }
                },
                {
                    data: 'SLCT',
                    render: function (data) {
                        if (data == null) {
                            return '0 cái';
                        }
                        else return data + ' cái';
                    }
                },
                {
                    data: 'TongGia',
                    render: function (data) {
                        return Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(data);
                    }
                },
                {
                    data: 'MaPN',
                    width: '195.4px',
                    render: function (data) {
                        return "<button class='btn btn-primary edit-button'  data-id='" + data + "'><i class='fa fa-wrench' style='margin-right:.3rem' aria-hidden='true'></i>Chi tiết</button><button class='btn btn-danger delete-button' data-id='" + data + "'><i class='fa fa-trash' style='margin-right:.3rem' aria-hidden='true'></i>Xóa</button>";
                    },
                    className: 'action-col',
                    sortable: false
                }
            ],
            "lengthMenu": [[20, -1], [20, "Tất cả"]],
            "language": {
                "sInfoFiltered": "",
                "sInfoEmpty": "",
                "sInfo": "Tổng số _TOTAL_ phiếu nhập",
                "sEmptyTable": "Không có dữ liệu, Vui lòng <b>Thêm</b> phiếu mới",
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
        $('#mpn-control').prop('disabled', true);
    }
}

$(document).ready(function () {
    PhieuNhapController.init();
});