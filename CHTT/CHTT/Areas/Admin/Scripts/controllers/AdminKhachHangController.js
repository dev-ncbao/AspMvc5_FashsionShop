var dataTable;
var isAdd;
var KhachHangController = {
    init: function () {
        KhachHangController.loadIndexData();
        KhachHangController.registerEvents();
        setTimeout($('.nav-item')[2].classList.add('active'), 200);
    },
    registerEvents: function () {
        $('#btn-add-kh').off('click').on('click', function () {
            $('.modal-title').empty().append('THÊM KHÁCH HÀNG');
            $('#PhaiNam').prop('checked', true);
            KhachHangController.getNextCustomerID();
            KhachHangController.resetAOEForm();
            isAdd = true;
            $('#aoe-modal').modal('show');
            KhachHangController.registerEvents();
        });

        $(document).off('click', '.edit-button').on('click', '.edit-button', function () {
            var MaKH = $(this).data('id');
            isAdd = false;
            KhachHangController.resetAOEForm();
            $('.modal-title').empty().append('CHỈNH SỬA KHÁCH HÀNG');
            KhachHangController.getEditDataAOEForm(MaKH);
            $('#aoe-modal').modal('show');
            KhachHangController.registerEvents();
        });

        $(document).off('click', '.delete-button').on('click', '.delete-button', function () {
            var MaKH = $(this).data('id');
            if (confirm("Bạn muốn xóa khách hàng " + MaKH + "?")) {
                KhachHangController.deleteCustomer(MaKH);
            }
            KhachHangController.registerEvents();
        });

        //close modal
        $(document).off('click', '#close-modal').on('click', '#close-modal', function () {
            $('#aoe-modal').modal('hide');
            KhachHangController.registerEvents();
        });

        $('#save-button').off('click').on('click', function () {
            if (KhachHangController.validationAOEForm()) {
                KhachHangController.submitAOEForm(isAdd);
            }
            else {
                $.notify('Vui lòng kiểm tra lại thông tin', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
            KhachHangController.registerEvents();
        });

        $('#reset-button').off('click').on('click', function () {
            KhachHangController.resetAOEForm();
            KhachHangController.registerEvents();
        });
    },
    deleteCustomer: function (strMaKH) {
        $.ajax({
            url: '/quan-ly/khach-hang/Delete',
            type: 'POST',
            dataType: 'json',
            data: {
                strMaKH: strMaKH
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
    getEditDataAOEForm: function (strMaKH) {
        $.ajax({
            url: '/quan-ly/khach-hang/GetEditData',
            type: 'GET',
            dataType: 'json',
            data: {
                strMaKH: strMaKH
            },
            success: function (response) {
                if (response.status) {
                    var HoTen = $('#hoten-control');
                    var NgaySinh = $('#ngaysinh-control');
                    var SDT = $('#sdt-control');
                    var Email = $('#email-control');
                    var TK = $('#tk-control');
                    var DiaChi = $('#diachi-control');
                    var MK = $('#mk-control');
                    var MK2 = $('#mkagain-control');
                    var MaKH = $('#mkh-control');
                    var KichHoat = $('#active-control');
                    var data = response.data;

                    MaKH.val(data.MaKH);
                    HoTen.val(data.HoTen);
                    var date = new Date(parseInt(data.NgaySinh.substring(6).replace(')/', '')));
                    var day = date.getDate().toString();
                    var month = (date.getMonth() + 1).toString();
                    var strDate = date.getFullYear().toString() + '-' + (month.length == 2 ? month : ('0' + month)) + '-' + (day.length == 2 ? day : ('0' + day));
                    NgaySinh.val(strDate);
                    data.Phai == 'Nam' ? $('#PhaiNam').prop('checked', true) : $('#PhaiNu').prop('checked', true);
                    SDT.val(data.SoDienThoai);
                    Email.val(data.Email);
                    TK.val(data.TaiKhoan)
                    DiaChi.val(data.DiaChi);
                    MK.val(data.MatKhau);
                    MK2.val(data.MatKhau);
                    data.KichHoat == 1 ? KichHoat.prop('checked', true) : KichHoat.prop('checked', false);
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
        var HoTen = $('#hoten-control');
        var NgaySinh = $('#ngaysinh-control');
        var GioiTinh = document.getElementsByName('Phai');
        var SDT = $('#sdt-control');
        var Email = $('#email-control');
        var TK = $('#tk-control');
        var DiaChi = $('#diachi-control');
        var MK = $('#mk-control');
        var MaKH = $('#mkh-control');
        var Phai = $('#PhaiNam').prop('checked') ? GioiTinh[0].value : GioiTinh[1].value;
        var KichHoat = $('#active-control').prop('checked') ? 1 : 0;
        model = {
            MaKH: MaKH.val(),
            HoTen: HoTen.val(),
            NgaySinh: NgaySinh.val(),
            Phai: Phai,
            SoDienThoai: SDT.val(),
            DiaChi: DiaChi.val(),
            TaiKhoan: TK.val(),
            Email: Email.val(),
            MatKhau: MK.val(),
            KichHoat: KichHoat
        }

        $.ajax({
            url: '/quan-ly/khach-hang/AddOrEdit',
            type: 'POST',
            dataType: 'json',
            data: {
                model: model,
                isAdd: isAdd
            },
            success: function (response) {
                if (response.status) {
                    dataTable.ajax.reload(null, false);
                    $.notify(response.message, {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-success'
                    });
                    $('#aoe-modal').modal('hide');
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
    resetAOEForm: function () {
        var HoTen = $('#hoten-control');
        var NgaySinh = $('#ngaysinh-control');
        var GioiTinh = $('#gt-container > .gt-control > #PhaiNam');
        var SDT = $('#sdt-control');
        var Email = $('#email-control');
        var TK = $('#tk-control');
        var MK = $('#mk-control');
        var MK2 = $('#mkagain-control');
        var MaKH = $('#mkh-control');
        var DiaChi = $('#diachi-control');
        var KichHoat = $('#active-control');

        KichHoat.prop('checked', true);
        MaKH.removeClass('input-success-outline').removeClass('input-danger-outline');
        HoTen.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
        NgaySinh.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
        SDT.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
        Email.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
        TK.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
        DiaChi.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
        MK.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
        MK2.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
        GioiTinh.prop('checked', true);
    },
    validationAOEForm: function () {
        var MaKH = $('#mkh-control');
        var HoTen = $('#hoten-control');
        var NgaySinh = $('#ngaysinh-control');
        var SDT = $('#sdt-control');
        var Email = $('#email-control');
        var TK = $('#tk-control');
        var DiaChi = $('#diachi-control');
        var MK = $('#mk-control');
        var MK2 = $('#mkagain-control');

        if (MaKH.val().length == 0) {
            MaKH.addClass('input-danger-outline');
            MaKH.removeClass('input-success-outline');
        }
        else {
            MaKH.addClass('input-success-outline');
            MaKH.removeClass('input-danger-outline');
        }

        HoTen.val(HoTen.val().trim());
        if (HoTen.val().length == 0) {
            HoTen.addClass('input-danger-outline');
            HoTen.removeClass('input-success-outline');
        }
        else {
            HoTen.addClass('input-success-outline');
            HoTen.removeClass('input-danger-outline');
        }

        TK.val(TK.val().trim());
        if (TK.val().length == 0) {
            TK.addClass('input-danger-outline');
            TK.removeClass('input-success-outline');
        }
        else {
            TK.addClass('input-success-outline');
            TK.removeClass('input-danger-outline');
        }

        if (NgaySinh.val().length == 0 || new Date(NgaySinh.val()) > new Date()) {
            NgaySinh.addClass('input-danger-outline');
            NgaySinh.removeClass('input-success-outline');
        }
        else {
            NgaySinh.addClass('input-success-outline');
            NgaySinh.removeClass('input-danger-outline');
        }


        SDT.val(SDT.val().trim());
        if (SDT.val().length == 0 || SDT.val().length != 10 || !Number.isInteger(parseInt(SDT.val()))) {
            SDT.addClass('input-danger-outline');
            SDT.removeClass('input-success-outline');
        }
        else {
            SDT.addClass('input-success-outline');
            SDT.removeClass('input-danger-outline');
        }

        Email.val(Email.val().trim());
        var testString = new RegExp('^[a-z0-9]*@[a-z]*\.*[a-z]{2,4}$');
        if (Email.val().length != 0 && !testString.test(Email.val())) {
            Email.addClass('input-danger-outline');
            Email.removeClass('input-success-outline');
        }
        else {
            Email.addClass('input-success-outline');
            Email.removeClass('input-danger-outline');
        }

        DiaChi.val(DiaChi.val().trim());
        if (DiaChi.val().length == 0) {
            DiaChi.addClass('input-danger-outline');
            DiaChi.removeClass('input-success-outline');
        }
        else {
            DiaChi.addClass('input-success-outline');
            DiaChi.removeClass('input-danger-outline');
        }

        MK.val(MK.val().trim());
        if (MK.val().length < 6 || MK.val().length > 64) {
            MK.addClass('input-danger-outline');
            MK.removeClass('input-success-outline');
        }
        else {
            MK.addClass('input-success-outline');
            MK.removeClass('input-danger-outline');
        }

        MK2.val(MK2.val().trim());
        if (MK2.val().length < 6 || MK2.val().length > 64 || MK.hasClass('input-danger-outline') || MK.val() != MK2.val()) {
            MK2.addClass('input-danger-outline');
            MK2.removeClass('input-success-outline');
        }
        else {
            MK2.addClass('input-success-outline');
            MK2.removeClass('input-danger-outline');
        }

        if (MaKH.hasClass('input-success-outline') &&
            HoTen.hasClass('input-success-outline') &&
            NgaySinh.hasClass('input-success-outline') &&
            DiaChi.hasClass('input-success-outline') &&
            TK.hasClass('input-success-outline') &&
            Email.hasClass('input-success-outline') &&
            MK.hasClass('input-success-outline') &&
            MK2.hasClass('input-success-outline') &&
            SDT.hasClass('input-success-outline')) {
            return true;
        }
        else return false;
    },
    getNextCustomerID: function () {
        $.ajax({
            url: '/quan-ly/khach-hang/GetNextCustomerID',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#mkh-control').val(response.strMaKH);
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
    loadIndexData: function () {
        dataTable = $('#KHTable').DataTable({
            ajax: {
                url: '/quan-ly/khach-hang/LoadIndexData',
                type: 'GET',
                datatype: 'json'
            },
            columns: [
                { data: 'MaKH' },
                { data: 'HoTen' },
                { data: 'Phai' },
                {
                    data: 'NgaySinh',
                    render: function (data) {
                        data = data.replace('/Date(', '');
                        var fullDateTime = new Date(parseInt(data));
                        var date = "";
                        fullDateTime.getDate() < 10 ? date += '0' + fullDateTime.getDate() + '/' : date += fullDateTime.getDate() + '/';
                        fullDateTime.getMonth() + 1 < 10 ? date += '0' + (fullDateTime.getMonth() + 1) : date += (fullDateTime.getMonth() + 1);
                        date += '/' + fullDateTime.getFullYear();
                        return date;
                    }
                },
                {
                    data: 'DiaChi',
                },
                { data: 'SoDienThoai' },
                {
                    data: 'KichHoat',
                    render: function (data) {
                        if (data == 1) {
                            return 'Đang hoạt động';
                        }
                        else {
                            return 'Đang khóa';
                        }
                    }
                },
                {
                    data: 'MaKH',
                    width:'174px',
                    render: function (data) {
                        return "<button class='btn btn-primary edit-button'  data-id='" + data + "'><i class='fa fa-wrench' style='margin-right:.3rem' aria-hidden='true'></i>Sửa</button><button class='btn btn-danger delete-button' data-id='" + data + "'><i class='fa fa-trash' style='margin-right:.3rem' aria-hidden='true'></i>Xóa</button>";
                    },
                    className: 'action-col',
                    sortable: false
                }
            ],
            "lengthMenu": [[20, -1], [20, "Tất cả"]],
            "language": {
                "sInfoFiltered": "",
                "sInfoEmpty": "",
                "sInfo": "Tổng số _TOTAL_ khách hàng",
                "sEmptyTable": "Không có dữ liệu, Vui lòng <b>Thêm</b> khách hàng mới",
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

        $('#mkh-control').prop('disabled', true);
        document.getElementsByClassName('action-col')[0].classList.remove('action-col');
    }
};

$(document).ready(function () {
    KhachHangController.init();
});

