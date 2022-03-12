var NCCVal;
var NgayNhapVal;
var isAdd;
var dataTable;
var PhieuNhapDetail = {
    init: function () {
        PhieuNhapDetail.loadDetailTableData();
        PhieuNhapDetail.reformatInformation();
        PhieuNhapDetail.disableInformationControl();
        PhieuNhapDetail.registerEvents();
        PhieuNhapDetail.getDetailModal();
        /*PhieuNhapDetail.getOldModal();*/
        setTimeout(function () {
            $('.nav-item')[5].classList.add('active');
            PhieuNhapDetail.getOldProduct();
        }, 200);
    },
    registerEvents: function () {
        $('#btn-edit-pn').off('click').on('click', function () {
            PhieuNhapDetail.informationEditModeBackground();
            PhieuNhapDetail.enableInformationControlForEdit();
            $(this).css('display', 'none');
            $('#btn-save-pn').css('display', 'block');
            $('#btn-cancel-pn').css('display', 'block');
             NCCVal = $('#ncc-control').val();
            NgayNhapVal = $('#ngaynhap-control').val();
            console.log(NCCVal);
            PhieuNhapDetail.registerEvents();
        });

        $('#btn-save-pn').off('click').on('click', function () {
            if (PhieuNhapDetail.validationInformationControl()) {
                PhieuNhapDetail.submitInformationForm();
            }
            else {
                $.notify('Vui lòng kiểm tra lại thông tin', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
            PhieuNhapDetail.registerEvents();
        });

        $('#btn-cancel-pn').off('click').on('click', function () {
            $('#btn-edit-pn').css('display', 'block');
            $('#btn-save-pn').css('display', 'none');
            $('#btn-cancel-pn').css('display', 'none');
            $('#ncc-control').val(NCCVal);
            $('#ngaynhap-control').val(NgayNhapVal);
            PhieuNhapDetail.disableInformationControl();
            PhieuNhapDetail.informationNormalModeBackground();
            PhieuNhapDetail.registerEvents();
        });

        $('#btn-add-ctpn').off('click').on('click', function () {
            $('.modal-title').html('THÊM CHI TIẾT PHIẾU');
            PhieuNhapDetail.resetAOEForm();
            PhieuNhapDetail.getNextProductID();
            $('#aoe-modal').modal('show');
            isAdd = true;
            PhieuNhapDetail.registerEvents();
        });

        $('#btn-add-ctpn-old').off('click').on('click', function () {
            PhieuNhapDetail.resetAddOldForm();
            $('#add-old-modal').modal('show');
            //isAdd = true;
            PhieuNhapDetail.registerEvents();
        });

        $('#save-button').off('click').on('click', function () {
            if (PhieuNhapDetail.validationAOEForm()) {
                PhieuNhapDetail.submitAOEForm(isAdd);
            }
            else {
                $.notify('Vui lòng kiểm tra lại thông tin', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
            PhieuNhapDetail.registerEvents();
        });

        $('#reset-button').off('click').on('click', function () {
            PhieuNhapDetail.resetAOEForm();
            PhieuNhapDetail.registerEvents();
        });

        $('#save-old-button').off('click').on('click', function () {
            if (PhieuNhapDetail.validationAddOldForm()) {
                PhieuNhapDetail.submitAddOldForm();
            }
            else {
                $.notify('Vui lòng kiểm tra lại thông tin', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
            PhieuNhapDetail.registerEvents();
        });

        $('#reset-old-button').off('click').on('click', function () {
            PhieuNhapDetail.resetAddOldForm();
            PhieuNhapDetail.registerEvents();
        });

        $(document).off('click', '#close-modal').on('click', '#close-modal', function () {
            $('#aoe-modal').modal('hide');
            PhieuNhapDetail.registerEvents();
        });

        $(document).off('click', '#close-old-modal').on('click', '#close-old-modal', function () {
            $('#add-old-modal').modal('hide');
            PhieuNhapDetail.registerEvents();
        });

        $(document).off('click', '.delete-button').on('click', '.delete-button', function () {
            var MaSP = $(this).data('id');
            var MaPN = $('#mpn-control').val();
            if (confirm("Bạn muốn xóa chi tiết phiếu này?")) {
                PhieuNhapDetail.deleteDetailRecord(MaSP, MaPN);
            }
            PhieuNhapDetail.registerEvents();
        });

        $(document).off('click', '.detail-button').on('click', '.detail-button', function () {
            var MaSP = $(this).data('id');
            location.href = '/quan-ly/san-pham/chi-tiet/?strID=' + MaSP;
            PhieuNhapDetail.registerEvents();
        });

        $(document).off('click', '.edit-button').on('click', '.edit-button', function () {
            var MaSP = $(this).data('id');
            var MaPN = $('#mpn-control').val();
            PhieuNhapDetail.resetAOEForm();
            $('.modal-title').html('CHỈNH SỬA CHI TIẾT PHIẾU');
            isAdd = false;
            PhieuNhapDetail.getDetailEditData(MaSP, MaPN);
            $('#aoe-modal').modal('show');
            PhieuNhapDetail.registerEvents();
        });
    },
    getOldProduct: function () {
        $.ajax({
            url: '/quan-ly/phieu-nhap/GetOldProduct',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                var select = $('#old-product');
                $.each(response.data, function (i, item) {
                    select.append('<option value="'+item.MaSP+'">'+item.TenSP+'</option>');
                });
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
    deleteDetailRecord: function (strMaSP,strMaPN) {
        $.ajax({
            url: '/quan-ly/phieu-nhap/DeleteDetailRecord',
            type: 'POST',
            dataType: 'json',
            data: {
                strMaPN: strMaPN,
                strMaSP: strMaSP
            },
            success: function (response) {
                if (response.status) {
                    PhieuNhapDetail.reloadInformation(strMaPN);
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
    getDetailEditData: function (strMaSP,strMaPN) {
        $.ajax({
            url: '/quan-ly/phieu-nhap/GetDetailEditData',
            type: 'GET',
            dataType: 'json',
            data: {
                strMaPN: strMaPN,
                strMaSP: strMaSP
            },
            success: function (response) {
                if (response.status) {
                    var TenSP = $('#tensp-control');
                    var GiaNhap = $('#gn-control');
                    var SoLuong = $('#sl-control');
                    var MaSP = $('#msp-control');
                    var data = response.data;
                    TenSP.val(data.TenSP);
                    MaSP.val(data.MaSP);
                    GiaNhap.val(data.GiaNhap);
                    SoLuong.val(data.SoLuong);
                }
                else {
                    $.notify('Đã xảy ra lỗi khi lấy dữ liệu từ Server', {
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
    reloadInformation: function (strMaPN) {
        $.ajax({
            url: '/quan-ly/phieu-nhap/ReloadInformation',
            type: 'GET',
            dataType: 'json',
            data: {
                strMaPN: strMaPN
            },
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    if (data == null) {
                        $('#slct-control').val('');
                        $('#slth-control').val('');
                        $('#tg-control').val('');
                    }
                    else {
                        $('#slct-control').val(data.SLCT);
                        $('#slth-control').val(data.SLTH);
                        $('#tg-control').val(data.TongGia);
                    }
                    PhieuNhapDetail.reformatInformation();
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
    submitAOEForm: function (isAdd) {
        var MaPN = $('#mpn-control');
        var NCC = $('#ncc-control');
        var TenSP = $('#tensp-control');
        var GiaNhap = $('#gn-control');
        var SoLuong = $('#sl-control');
        var MaSP = $('#msp-control');
        model = {
            MaPN: MaPN.val(),
            MaSP: MaSP.val(),
            SoLuong: SoLuong.val(),
            GiaNhap: GiaNhap.val()
        }
        $.ajax({
            url: '/quan-ly/phieu-nhap/AddOrEditDetail',
            type: 'POST',
            dataType: 'json',
            data: {
                model: model,
                strMaNCC: NCC.val(),
                strTenSP: TenSP.val(),
                isAdd: isAdd
            },
            success: function (response) {
                if (response.status) {
                    PhieuNhapDetail.reloadInformation(MaPN.val());
                    dataTable.ajax.reload(null,false);
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
    submitAddOldForm: function () {
        var GiaNhap = $('#gn-old-control');
        var SoLuong = $('#sl-old-control');
        var MaSP = $('#old-product');
        var MaPN = $('#mpn-control');
        model = {
            MaPN: MaPN.val(),
            MaSP: MaSP.val(),
            SoLuong: SoLuong.val(),
            GiaNhap: GiaNhap.val()
        }
        $.ajax({
            url: '/quan-ly/phieu-nhap/AddOrEditDetail',
            type: 'POST',
            dataType: 'json',
            data: {
                model: model,
                isAdd: true
            },
            success: function (response) {
                if (response.status) {
                    PhieuNhapDetail.reloadInformation(MaPN.val());
                    dataTable.ajax.reload(null, false);
                    $.notify(response.message, {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-success'
                    });
                    $('#add-old-modal').modal('hide');
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
        var TenSP = $('#tensp-control');
        var GiaNhap = $('#gn-control');
        var SoLuong = $('#sl-control');
        var MaSP = $('#msp-control');

        MaSP.val(MaSP.val().trim());
        if (MaSP.val().length == 0) {
            MaSP.addClass('input-danger-outline');
            MaSP.removeClass('input-success-outline');
        }
        else {
            MaSP.addClass('input-success-outline');
            MaSP.removeClass('input-danger-outline');
        }

        TenSP.val(TenSP.val().trim());
        if (TenSP.val().length == 0) {
            TenSP.addClass('input-danger-outline');
            TenSP.removeClass('input-success-outline');
        }
        else {
            TenSP.addClass('input-success-outline');
            TenSP.removeClass('input-danger-outline');
        }

        GiaNhap.val(GiaNhap.val().trim());
        if (GiaNhap.val().length == 0 || GiaNhap.val() <= 0 || !Number.isInteger(parseInt(GiaNhap.val()))) {
            GiaNhap.addClass('input-danger-outline');
            GiaNhap.removeClass('input-success-outline');
        }
        else {
            GiaNhap.addClass('input-success-outline');
            GiaNhap.removeClass('input-danger-outline');
        }

        SoLuong.val(SoLuong.val().trim());
        if (SoLuong.val().length == 0 || SoLuong.val() <= 0 || !Number.isInteger(parseInt(SoLuong.val()))) {
            SoLuong.addClass('input-danger-outline');
            SoLuong.removeClass('input-success-outline');
        }
        else {
            SoLuong.addClass('input-success-outline');
            SoLuong.removeClass('input-danger-outline');
        }

        if (MaSP.hasClass('input-success-outline') &&
            TenSP.hasClass('input-success-outline') &&
            SoLuong.hasClass('input-success-outline') &&
            GiaNhap.hasClass('input-success-outline')) {
            return true;
        }
        else return false;
    },
    resetAOEForm: function () {
        var TenSP = $('#tensp-control');
        var GiaNhap = $('#gn-control');
        var SoLuong = $('#sl-control');
        var MaSP = $('#msp-control');

        TenSP.val('').removeClass('input-danger-outline').removeClass('input-success-outline');
        SoLuong.val('').removeClass('input-danger-outline').removeClass('input-success-outline');
        GiaNhap.val('').removeClass('input-danger-outline').removeClass('input-success-outline');
        MaSP.removeClass('input-danger-outline').removeClass('input-success-outline');
    },
    validationAddOldForm: function () {
        var GiaNhap = $('#gn-old-control');
        var SoLuong = $('#sl-old-control');
        var Select = $('#old-product');

        if (Select.val().length == 0) {
            Select.addClass('input-danger-outline');
            Select.removeClass('input-success-outline');
        }
        else {
            Select.addClass('input-success-outline');
            Select.removeClass('input-danger-outline');
        }

        GiaNhap.val(GiaNhap.val().trim());
        if (GiaNhap.val().length == 0 || GiaNhap.val() <= 0 || !Number.isInteger(parseInt(GiaNhap.val()))) {
            GiaNhap.addClass('input-danger-outline');
            GiaNhap.removeClass('input-success-outline');
        }
        else {
            GiaNhap.addClass('input-success-outline');
            GiaNhap.removeClass('input-danger-outline');
        }

        SoLuong.val(SoLuong.val().trim());
        if (SoLuong.val().length == 0 || SoLuong.val() <= 0 || !Number.isInteger(parseInt(SoLuong.val()))) {
            SoLuong.addClass('input-danger-outline');
            SoLuong.removeClass('input-success-outline');
        }
        else {
            SoLuong.addClass('input-success-outline');
            SoLuong.removeClass('input-danger-outline');
        }

        if (Select.hasClass('input-success-outline') &&
            SoLuong.hasClass('input-success-outline') &&
            GiaNhap.hasClass('input-success-outline')) {
            return true;
        }
        else return false;
    },
    resetAddOldForm: function () {
        
        var GiaNhap = $('#gn-old-control');
        var SoLuong = $('#sl-old-control');

        SoLuong.val('').removeClass('input-danger-outline').removeClass('input-success-outline');
        GiaNhap.val('').removeClass('input-danger-outline').removeClass('input-success-outline');
    },
    getNextProductID: function () {
        $.ajax({
            url: '/quan-ly/phieu-nhap/GetNextProductID',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#msp-control').val(response.strMaSP);
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
    getDetailModal: function () {
        $.ajax({
            url: '/quan-ly/phieu-nhap/AOEDetailModal',
            type: 'GET',
            success: function (response) {
                $('#aoe-container').html(response);
                $('#msp-control').prop('disabled', true);
            },
            error: function () {
                $.notify('Đã xảy ra lỗi khi lấy dữ liệu từ Server', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    getOldModal: function () {
        $.ajax({
            url: '/quan-ly/phieu-nhap/AddOldModal',
            type: 'GET',
            success: function (response) {
                $('#add-old-container').html(response);
                /*$('#msp-control').prop('disabled', true);*/
            },
            error: function () {
                $.notify('Đã xảy ra lỗi khi lấy dữ liệu từ Server', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    submitInformationForm: function () {
        var MaPN = $('#mpn-control');
        var NCC = $('#ncc-control');
        var NgayNhap = $('#ngaynhap-control');
        model = {
            MaPN: MaPN.val(),
            MaNCC: NCC.val(),
            NgayNhap: NgayNhap.val()
        }
        $.ajax({
            url: '/quan-ly/phieu-nhap/AddOrEdit',
            type: 'POST',
            dataType: 'json',
            data: {
                model: model,
                isAdd: false
            },
            success: function (response) {
                if (response.status) {
                        $.notify(response.message, {
                            globalPosition: 'top right',
                            style: 'myNotify',
                            className: 'noti-success'
                        });
                    $('#btn-edit-pn').css('display', 'block');
                    $('#btn-save-pn').css('display', 'none');
                    $('#btn-cancel-pn').css('display', 'none');
                    PhieuNhapDetail.disableInformationControl();
                    PhieuNhapDetail.informationNormalModeBackground();
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
    validationInformationControl: function () {
        var MaPN = $('#mpn-control');
        var NCC = $('#ncc-control');
        var NgayNhap = $('#ngaynhap-control');
        var SLTH = $('#slth-control');
        var SLCT = $('#slct-control');
        var TongGia = $('#tg-control');

        MaPN.val(MaPN.val().trim());
        if (MaPN.val().length == 0) {
            MaPN.addClass('input-danger-outline');
            MaPN.removeClass('input-success-outline');
        }
        else {
            MaPN.addClass('input-success-outline');
            MaPN.removeClass('input-danger-outline');
        }

        SLTH.val(SLTH.val().trim());
        if (SLTH.val().length == 0) {
            SLTH.addClass('input-danger-outline');
            SLTH.removeClass('input-success-outline');
        }
        else {
            SLTH.addClass('input-success-outline');
            SLTH.removeClass('input-danger-outline');
        }

        SLCT.val(SLCT.val().trim());
        if (SLCT.val().length == 0) {
            SLCT.addClass('input-danger-outline');
            SLCT.removeClass('input-success-outline');
        }
        else {
            SLCT.addClass('input-success-outline');
            SLCT.removeClass('input-danger-outline');
        }

        TongGia.val(TongGia.val().trim());
        if (TongGia.val().length == 0) {
            TongGia.addClass('input-danger-outline');
            TongGia.removeClass('input-success-outline');
        }
        else {
            TongGia.addClass('input-success-outline');
            TongGia.removeClass('input-danger-outline');
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
    loadDetailTableData: function () {
        dataTable = $('#PNTable').DataTable({
            ajax: {
                url: '/quan-ly/phieu-nhap/LoadDetailTableData',
                type: 'GET',
                dataType: 'json',
                data: {
                    strMaPN: $('#mpn-control').val()
                }
            },
            columns: [
                {
                    data: 'MaSP'
                },
                {
                    data: 'SoLuong',
                    render: function (data) {
                        return data + ' cái';
                    }
                },
                {
                    data: 'GiaNhap',
                    render: function (data) {
                        return Intl.NumberFormat('it-IT', {
                            style: 'currency',
                            currency:'VND'
                        }).format(data);
                    }
                },
                {
                    data: 'MaSP',
                    width: '268px',
                    render: function (data) {
                        return "<button class='btn btn-secondary detail-button'  data-id='" + data + "'><i class='fas fa-info-circle' style='margin-right:.3rem'></i>CTSP</button><button class='btn btn-primary edit-button'  data-id='" + data + "'><i class='fa fa-wrench' style='margin-right:.3rem' aria-hidden='true'></i>Sửa</button><button class='btn btn-danger delete-button' data-id='" + data + "'><i class='fa fa-trash' style='margin-right:.3rem' aria-hidden='true'></i>Xóa</button>";
                    },
                    className: 'action-col',
                    sortable: false
                }
            ],
            "lengthMenu": [[20, -1], [20, "Tất cả"]],
            "language": {
                "sInfoFiltered": "",
                "sInfoEmpty": "",
                "sInfo": "Tổng số _TOTAL_ chi tiết phiếu",
                "sEmptyTable": "Không có dữ liệu, Vui lòng <b>Thêm</b> chi tiết phiếu",
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
    },
    informationEditModeBackground: function () {
        var SLTH = $('#slth-control');
        var SLCT = $('#slct-control');
        var TongGia = $('#tg-control');
        var MaPN = $('#mpn-control');

        SLTH.removeClass('disabled-background');
        SLCT.removeClass('disabled-background');
        TongGia.removeClass('disabled-background');
        MaPN.removeClass('disabled-background');
    },
    informationNormalModeBackground: function () {
        var MaPN = $('#mpn-control');
        var NCC = $('#ncc-control');
        var NgayNhap = $('#ngaynhap-control');
        var SLTH = $('#slth-control');
        var SLCT = $('#slct-control');
        var TongGia = $('#tg-control');

        SLTH.addClass('disabled-background').removeClass('input-danger-outline').removeClass('input-success-outline');
        SLCT.addClass('disabled-background').removeClass('input-danger-outline').removeClass('input-success-outline');
        TongGia.addClass('disabled-background').removeClass('input-danger-outline').removeClass('input-success-outline');
        MaPN.addClass('disabled-background').removeClass('input-danger-outline').removeClass('input-success-outline');
        NgayNhap.removeClass('input-danger-outline').removeClass('input-success-outline');
        NCC.removeClass('input-danger-outline').removeClass('input-success-outline');
    },
    enableInformationControlForEdit: function () {

        var NgayNhap = $('#ngaynhap-control');
        var NCC = $('#ncc-control');

        NgayNhap.prop('disabled', false).addClass('disabled-background');
        NCC.prop('disabled', false).addClass('disabled-background');
    },
    disableInformationControl: function () {
        var NgayNhap = $('#ngaynhap-control');
        var SLTH = $('#slth-control');
        var SLCT = $('#slct-control');
        var TongGia = $('#tg-control');
        var MaPN = $('#mpn-control');
        var NCC = $('#ncc-control');

        NgayNhap.prop('disabled', true).addClass('disabled-background');
        SLTH.prop('disabled', true).addClass('disabled-background');
        SLCT.prop('disabled', true).addClass('disabled-background');
        TongGia.prop('disabled', true).addClass('disabled-background');
        MaPN.prop('disabled', true).addClass('disabled-background');
        NCC.prop('disabled', true).addClass('disabled-background');
    },
    reformatInformation: function () {
        var NgayNhap = $('#ngaynhap-control');
        var SLTH = $('#slth-control');
        var SLCT = $('#slct-control');
        var TongGia = $('#tg-control');

        NgayNhap.val(NgayNhapConvert);
        SLTH.val(SLTH.val().length == 0 ? '0 sản phẩm' : (SLTH.val() + ' sản phẩm'));
        SLCT.val(SLCT.val().length == 0 ? '0 cái' : (SLCT.val() + ' cái'));
        TongGia.val(Intl.NumberFormat('it-IT', { style:'currency',currency:'VND' }).format(TongGia.val())); 
    }
}

$(document).ready(function () {
    PhieuNhapDetail.init();
});