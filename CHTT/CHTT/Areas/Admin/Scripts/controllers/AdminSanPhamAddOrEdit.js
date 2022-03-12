var dataTable;
var formData;
var stateAOESize;
var SanPhamAOE = {
    init: function () {
        /*if (AOEProductState) {
            SanPhamAOE.loadInformation($('#MSSP').data('id'));
        }
        else {
            SanPhamAOE.loadData($('#MSSP').data('id'));
        }*/
        SanPhamAOE.loadData($('#MSSP').data('id'));
        SanPhamAOE.registerEvents();
        setTimeout($('.nav-item')[1].classList.add('active'), 200);
    },
    registerEvents: function () {

        $('#btn-add-size').off('click').on('click', function () {
            SanPhamAOE.resetSizeForm();
            stateAOESize = true;
            $('.modal-title').empty().append('THÊM PHÂN LOẠI - GIÁ BÁN');
            $('#aoe-sizeprice-modal').modal('show');
            SanPhamAOE.registerEvents();
        });

        $('#close-modal').off('click').on('click', function () {
            $('#aoe-sizeprice-modal').modal('hide');
            $('.modal-backdrop').fadeOut();
            SanPhamAOE.registerEvents();
        });//close form

        $('#btn-reset-size-form').off('click').on('click', function () {
            SanPhamAOE.resetSizeForm();
            SanPhamAOE.registerEvents();
        });// reset form

        $('#btn-submit-size-form').off('click').on('click', function () {
            if (SanPhamAOE.validationSize()) {
                var SoLuong = $('#SoLuong');
                var GiaBan = $('#Gia');
                var Size = $('#Size');
                var data = {
                    MaSP: $('#MaSP').val(),
                    Size: Size.val(),
                    Gia: GiaBan.val(),
                    SoLuong: SoLuong.val()
                }
                SanPhamAOE.submitSizeForm(data, stateAOESize);
            }
            else {
                $.notify('Vui lòng nhập đầy đủ thông tin', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
            SanPhamAOE.registerEvents();
        });// submit form add sizeprice

        $(document).off('click', '.btn-delete-size').on('click', '.btn-delete-size', function () {
            var strMaSP = $(this).data('id');
            var strSize = $(this).data('size');
            if (confirm('Bạn thật sự muốn xóa size "' + strSize + '"?')) {
                SanPhamAOE.deleteSizeRecord(strMaSP, strSize);
                SanPhamAOE.reloadSizeTable();
            }
            SanPhamAOE.registerEvents();
        });// delete sizeprice

        $(document).off('click', '.btn-edit-size').on('click', '.btn-edit-size', function () {
            var strMaSP = $(this).data('id');
            var strSize = $(this).data('size');
            stateAOESize = false;
            SanPhamAOE.getSizeEditData(strMaSP, strSize);
            SanPhamAOE.registerEvents();
        });// edit sizeprice

        $(document).off('click', '.img-component-container').on('click', '.img-component-container', function () {
            var strMaSP = $(this).data('id');
            if (confirm('Bạn có chắc muốn xóa hình ảnh này?')) {
                SanPhamAOE.deletePicture(strMaSP);
                $(this).remove();
            }
        });// delete a picture

        $('#btn-edit-information').off('click').on('click', function () {
            var curSelect = $('#detail-category-dropdown').val();
            SanPhamAOE.clearDetailCategory();
            SanPhamAOE.setDetailCategory($('#category-dropdown').val(), curSelect);
            $('#btn-save-information').css('display', 'block');
            $('#btn-cancel-information').css('display', 'block');
            $(this).css('display', 'none');
            SanPhamAOE.enableEditInformation();
        });

        $('#btn-cancel-information').off('click').on('click', function () {
            SanPhamAOE.loadInformation($('#MSSP').data('id'));
            $('#btn-save-information').css('display', 'none');
            $('#btn-edit-information').css('display', 'block');
            $(this).css('display', 'none');
            SanPhamAOE.disableEditInformation();
        });

        $('#btn-save-information').off('click').on('click', function () {
            if (SanPhamAOE.validationInformation()) {
                var model = {
                    MaSP: $('#MaSP').val(),
                    TenSP: $('#TenSP').val(),
                    MoTa: $('#MoTa').val(),
                    MaDoiTuong: $('#MaDoiTuong').val(),
                    MaLoai: $('#category-dropdown').val(),
                    MaCTLoai: $('#detail-category-dropdown').val()
                };
                $.ajax({
                    url: '/quan-ly/san-pham/AddOrEditInformation',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        model: model
                    },
                    success: function (response) {
                        if (response.status) {
                            if (AOEProductState) {
                                var cardElements = document.querySelectorAll('.card');
                                cardElements[1].style.display = 'flex';
                                cardElements[2].style.display = 'flex';
                                $('#btn-save-information').css('display', 'none');
                                $('#btn-cancel-information').css('display', 'none');
                                $('#btn-edit-information').css('display', 'block');
                                $('#MaSP').removeClass('input-success-outline');
                                $('#TenNCC').removeClass('input-success-outline');
                                $('#TenSP').removeClass('input-success-outline');
                                $('#MoTa').removeClass('input-success-outline');
                                $('#MaDoiTuong').removeClass('input-success-outline');
                                $('#category-dropdown').removeClass('input-success-outline');
                                $('#detail-category-dropdown').removeClass('input-success-outline');
                                SanPhamAOE.disableEditInformation();
                                $.notify("Đã lưu! Bây giờ bạn có thể thêm size và hình ảnh", {
                                    globalPosition: 'top right',
                                    className: 'noti-success',
                                    style: 'myNotify'
                                });
                            }
                            else {
                                SanPhamAOE.loadInformation($('#MSSP').data('id'));
                                $('#btn-save-information').css('display', 'none');
                                $('#btn-cancel-information').css('display', 'none');
                                $('#btn-edit-information').css('display', 'block');
                                SanPhamAOE.disableEditInformation();
                                $.notify(response.message, {
                                    globalPosition: 'top right',
                                    style: 'myNotify',
                                    className: 'noti-success'
                                });
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
                        $.notify("Kết nối đến máy chủ bị lỗi", {
                            globalPosition: 'top right',
                            style: 'myNotify',
                            className: 'noti-danger'
                        });
                    }
                });
            }
            else {
                $.notify("Vui lòng kiểm tra lại thông tin", {
                    globalPosition: "top right",
                    className: 'noti-danger',
                    style: 'myNotify'
                });
            }
        });

        $('#btn-add-images').off('click').on('click', function () {
            $('#btn-save-images').css('display', 'block');
            $('#btn-cancel-images').css('display', 'block');
            $(this).css('display', 'none');
            SanPhamAOE.clearImageContainer();
            $('.image-length').append('Số lượng hình ảnh muốn thêm: chưa có');
        });

        $('#file').off('change').on('change', function (event) {
            //SanPhamAOE.clearImageContainer();
            var files = event.target.files;
            formData = new FormData();
            formData.append('MaSP', $('#MaSP').val());
            $.each(files, function (i, item) {
                formData.append('file', item);
                $('#image-list').append("<div class='img-component-container'>" +
                    '<img src ="' + URL.createObjectURL(files[i]) + '"/>' +
                    "</div >");
            });
            $('.image-length').empty().append('Số lượng hình ảnh muốn thêm: ' + files.length);
            /*for (var val of formData.values()) {
                console.log(val);
            }*/
        });

        $('#btn-save-images').off('click').on('click', function () {
            $.ajax({
                url: '/quan-ly/san-pham/AddPicture',
                type: 'POST',
                dataType: 'json',
                contentType: false,
                processData: false,
                data: formData,
                success: function (response) {
                    if (response.status) {
                        $('#btn-cancel-images').css('display', 'none');
                        $('#btn-save-images').css('display', 'none');
                        $('#btn-add-images').css('display', 'block');
                        SanPhamAOE.loadImages($('#MSSP').data('id'));
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
                    $.notify("Kết nối đến máy chủ bị lỗi", {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-danger'
                    });
                }
            });
        });
        $('#btn-cancel-images').off('click').on('click', function () {
            $(this).css('display', 'none');
            $('#btn-save-images').css('display', 'none');
            $('#btn-add-images').css('display', 'block');
            SanPhamAOE.loadImages($('#MSSP').data('id'));
        });

        $(document).off('change', '#category-dropdown').on('change', '#category-dropdown', function () {
            var strMaLoai = $(this).val();
            SanPhamAOE.clearDetailCategory();
            SanPhamAOE.setDetailCategory(strMaLoai);
            SanPhamAOE.registerEvents();
            if (!($('#category-dropdown').prop('disabled'))) {
                if ($(this).val().length != 0) {
                    /*$(this).removeClass('input-danger-outline');
                    $(this).addClass('input-success-outline');*/
                    $('#detail-category-dropdown').prop('disabled', false);
                }
                else {
                    /*$(this).removeClass('input-success-outline');
                    $(this).addClass('input-danger-outline');*/
                    $('#detail-category-dropdown').prop('disabled', true);
                }
            }
        });// reload dropdownlist

    },
    deletePicture: function (strLink) {
        var strMaSP = $('#MaSP').val();
        $.ajax({
            url: '/quan-ly/san-pham/DeletePicture',
            type: 'POST',
            data: {
                Link: strLink
            },
            success: function (response) {
                if (response.status) {
                    /*SanPhamAOE.loadImages(strMaSP);*/
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
                $.notify("Kết nối đến máy chủ bị lỗi", {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    getSizeEditData: function (strMaSP, strSize) {
        var soLuong = $('#SoLuong');
        var giaBan = $('#Gia');
        var size = $('#Size');
        $.ajax({
            url: '/quan-ly/san-pham/GetSizeEditData',
            type: 'GET',
            dataType: 'json',
            data: {
                strMaSP: strMaSP,
                strSize: strSize
            },
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    SanPhamAOE.resetSizeForm();
                    $('.modal-title').empty().append('CHỈNH SỬA PHÂN LOẠI - GIÁ BÁN');
                    size.val(data.Size);
                    soLuong.val(data.SoLuong);
                    giaBan.val(data.Gia);
                    $('#aoe-sizeprice-modal').modal('show');
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
                $.notify("Kết nối đến máy chủ bị lỗi", {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    resetSizeForm: function () {
        var soLuong = $('#SoLuong');
        var giaBan = $('#Gia');
        var size = $('#Size');
        soLuong.val('');
        giaBan.val('');
        size.val('');
        soLuong.removeClass('input-danger-outline');
        soLuong.removeClass('input-success-outline');
        giaBan.removeClass('input-danger-outline');
        giaBan.removeClass('input-success-outline');
        size.removeClass('input-danger-outline');
        size.removeClass('input-success-outline');
    },
    submitSizeForm: function (data, stateAOESize) {
        $.ajax({
            url: '/quan-ly/san-pham/AddOrEditSize',
            type: 'POST',
            dataType: 'json',
            data: {
                model: data,
                state: stateAOESize
            },
            success: function (response) {
                if (response.status) {
                    $('#aoe-sizeprice-modal').modal('hide');
                    $('.modal-backdrop').fadeOut();
                    $.notify(response.message, {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-success'
                    });
                    SanPhamAOE.reloadSizeTable();
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
                $.notify("Kết nối đến máy chủ bị lỗi", {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    enableEditInformation: function () {
        $('#MaSP').removeClass('disabled-background');
        $('#TenNCC').removeClass('disabled-background');
        $('#TenSP').prop('disabled', false);
        $('#MoTa').prop('disabled', false);
        $('#MaDoiTuong').prop('disabled', false);
        $('#category-dropdown').prop('disabled', false);
        $('#detail-category-dropdown').prop('disabled', false);
    },
    disableEditInformation: function () {
        $('#MaSP').addClass('disabled-background');
        $('#TenNCC').addClass('disabled-background');
        $('#TenSP').prop('disabled', true);
        $('#MoTa').prop('disabled', true);
        $('#MaDoiTuong').prop('disabled', true);
        $('#category-dropdown').prop('disabled', true);
        $('#detail-category-dropdown').prop('disabled', true);
    },
    deleteSizeRecord: function (strMaSP, strSize) {
        $.ajax({
            url: '/quan-ly/san-pham/DeleteSizeRecord',
            type: 'POST',
            dataType: 'json',
            data: {
                strMaSP: strMaSP,
                strSize: strSize
            },
            success: function (response) {
                if (response.status) {
                    $.notify(response.message, {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-success'
                    });
                    SanPhamAOE.reloadSizeTable();
                } else {
                    $.notify(response.message, {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-danger'
                    });
                }
            },
            error: function () {
                $.notify("Kết nối đến máy chủ bị lỗi", {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    reloadSizeTable: function () {
        dataTable.ajax.reload();
    },
    clearDetailCategory: function () {
        $('#detail-category-dropdown option').remove();
    },
    clearImageContainer: function () {
        $('#image-list .img-component-container').remove();
        $('.image-length').empty();
    },
    setDetailCategory: function (strMaLoai, curSelect) {
        $.ajax({
            url: '/quan-ly/san-pham/getChangeDetailCategory',
            type: 'GET',
            dataType: 'json',
            data: {
                idLoai: strMaLoai
            },
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    $.each(data, function (i, item) {
                        $('#detail-category-dropdown').append("<option value = '" + item.MaCTLoai + "' >" + item.TenCTLoai + "</option>");
                    });
                    if (curSelect != null) {
                        $('#detail-category-dropdown').val(curSelect);
                    }
                }
            },
            error: function () {
                $.notify("Kết nối đến máy chủ bị lỗi", {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    loadImages: function (strMaSP) {
        $.ajax({
            url: '/quan-ly/san-pham/Images',
            type: 'GET',
            dataType: 'json',
            data: {
                strID: strMaSP
            },
            success: function (response) {
                if (response.status) {
                    SanPhamAOE.clearImageContainer();
                    var data = response.data;
                    $.each(data, function (i, item) {
                        $('#image-list').append("<div class='img-component-container' data-id = '" + item.Link + "'>" +
                            '<img src ="' + item.Link + '"/>' +
                            "<div class='delete-img-button-wrapper'>" +
                            "<i class='delete-img-button fa fa-trash'></i>" +
                            "</div>" +
                            "</div >");
                    });
                    $('.image-length').append('Số lượng hình ảnh: ' + data.length);
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
                $.notify("Kết nối đến máy chủ bị lỗi", {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    validationInformation: function () {
        var MaSP = $('#MaSP');
        var TenNCC = $('#TenNCC');
        var TenSP = $('#TenSP');
        var MoTa = $('#MoTa');
        var MaDoiTuong = $('#MaDoiTuong');
        var Loai = $('#category-dropdown');
        var LoaiCT = $('#detail-category-dropdown');


        MaSP.val(MaSP.val().trim());
        if (MaSP.val().length == 0) {
            MaSP.addClass('input-danger-outline');
            MaSP.removeClass('input-success-outline');
        }
        else {
            MaSP.addClass('input-success-outline');
            MaSP.removeClass('input-danger-outline');
        }


        TenNCC.val(TenNCC.val().trim());
        if (TenNCC.val().length == 0) {
            TenNCC.addClass('input-danger-outline');
            TenNCC.removeClass('input-success-outline');
        }
        else {
            TenNCC.addClass('input-success-outline');
            TenNCC.removeClass('input-danger-outline');
        }


        MoTa.val(MoTa.val().trim());
        if (MoTa.val().length == 0) {
            MoTa.addClass('input-danger-outline');
            MoTa.removeClass('input-success-outline');
        }
        else {
            MoTa.addClass('input-success-outline');
            MoTa.removeClass('input-danger-outline');
        }

        if (MaDoiTuong.val().length == 0) {
            MaDoiTuong.addClass('input-danger-outline');
            MaDoiTuong.removeClass('input-success-outline');
        }
        else {
            MaDoiTuong.addClass('input-success-outline');
            MaDoiTuong.removeClass('input-danger-outline');
        }

        if (Loai.val() == null || Loai.val().length == 0) {
            Loai.addClass('input-danger-outline');
            Loai.removeClass('input-success-outline');
        }
        else {
            Loai.addClass('input-success-outline');
            Loai.removeClass('input-danger-outline');
        }

        if (LoaiCT.val() == null || LoaiCT.val().length == 0) {
            LoaiCT.addClass('input-danger-outline');
            LoaiCT.removeClass('input-success-outline');
        }
        else {
            LoaiCT.addClass('input-success-outline');
            LoaiCT.removeClass('input-danger-outline');
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

        if (MaSP.hasClass('input-success-outline') &&
            TenSP.hasClass('input-success-outline') &&
            TenNCC.hasClass('input-success-outline') &&
            MaDoiTuong.hasClass('input-success-outline') &&
            Loai.hasClass('input-success-outline') &&
            LoaiCT.hasClass('input-success-outline') &&
            MoTa.hasClass('input-success-outline')) {
            return true;
        }
        else return false;

    },
    validationSize: function () {
        var SoLuong = $('#SoLuong');
        var GiaBan = $('#Gia');
        var Size = $('#Size');

        SoLuong.val(SoLuong.val().trim());
        if (SoLuong.val().length == 0 || SoLuong.val() < 0 || !Number.isInteger(parseInt(SoLuong.val()))) {
            SoLuong.addClass('input-danger-outline');
            SoLuong.removeClass('input-success-outline');
        }
        else {
            SoLuong.addClass('input-success-outline');
            SoLuong.removeClass('input-danger-outline');
        }

        GiaBan.val(GiaBan.val().trim());
        if (GiaBan.val().length == 0 || GiaBan.val() <= 0 || !Number.isInteger(parseInt(GiaBan.val()))) {
            GiaBan.addClass('input-danger-outline');
            GiaBan.removeClass('input-success-outline');
        }
        else {
            GiaBan.addClass('input-success-outline');
            GiaBan.removeClass('input-danger-outline');
        }

        Size.val(Size.val().trim().toUpperCase());
        if (Size.val().length == 0) {
            Size.addClass('input-danger-outline');
            Size.removeClass('input-success-outline');
        }
        else {
            Size.addClass('input-success-outline');
            Size.removeClass('input-danger-outline');
        }

        if (
            GiaBan.hasClass('input-success-outline') &&
            SoLuong.hasClass('input-success-outline') &&
            Size.hasClass('input-success-outline')) {
            return true;
        }
        else return false;
    },
    loadInformation: function (strMaSP) {
        $.ajax({
            url: '/quan-ly/san-pham/Information',
            type: 'GET',
            data: {
                strID: strMaSP
            },
            success: function (response) {
                
                $('#information-container').html(response);
                $('#MaSP').prop('disabled', true).addClass('disabled-background');
                $('#TenNCC').prop('disabled', true).addClass('disabled-background');
                $('#TenSP').prop('disabled', true).addClass('disabled-background');
                $('#MoTa').prop('disabled', true).addClass('disabled-background');
                $('#MaDoiTuong').prop('disabled', true).addClass('disabled-background');
                $('#category-dropdown').prop('disabled', true).addClass('disabled-background');
                $('#detail-category-dropdown').prop('disabled', true).addClass('disabled-background');
                if (AOEProductState) {
                    SanPhamAOE.readyToAdd();
                }
            },
            error: function () {
                $.notify("Kết nối đến máy chủ bị lỗi", {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    loadData: function (strMaSP) {
        SanPhamAOE.loadInformation(strMaSP);
        SanPhamAOE.loadImages(strMaSP);
        dataTable = $('#size-table').DataTable({
            "ajax": {
                "url": "/quan-ly/san-pham/Size",
                "type": "GET",
                "datatype": "json",
                "data": {
                    strID: strMaSP
                }
            },
            "columns": [
                {
                    "data": "Size",
                    "width": "26%"
                },
                {
                    "data": "Gia",
                    "width": "26%"
                },
                {
                    "data": "SoLuong",
                    "width": "26%"
                },
                {
                    "data": "Size",
                    width:'174px',
                    "render": function (data) {
                        return "<button class='btn btn-primary btn-edit-size'  data-id='" + strMaSP + "' data-size='" + data + "'><i class='fa fa-wrench' style='margin-right:.3rem' aria-hidden='true'></i>Sửa</button><button class='btn btn-danger btn-delete-size' data-id='" + strMaSP + "' data-size='" + data + "'><i class='fa fa-trash' style='margin-right:.3rem' aria-hidden='true'></i>Xóa</button>";
                    },
                    "orderable": false,
                    "className": "action-col"
                }
            ],
            "lengthMenu": [[20, -1], [20, "Tất cả"]],
            "language": {
                sInfoFiltered: "",
                sInfoEmpty: "",
                sInfo: "Tổng số _TOTAL_ size",
                sEmptyTable: "Không có dữ liệu, Vui lòng <b>Thêm</b> size",
                sLengthMenu: "Hiển thị  _MENU_ dòng/ Trang",
                sSearch: "Tìm kiếm: ",
                sZeroRecords: "Không tìm thấy thông tin",
                sLoadingRecords: "Đang tải...",
                "paginate": {
                    "next": '<i class="fa fa-angle-right" aria-hidden="true"></i>',
                    "previous": '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                    "first": '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
                    "last": '<i class="fa fa-angle-double-right" aria-hidden="true"></i>'
                }
            },
            "pagingType": "full_numbers"
        });

        var actionCol = document.querySelectorAll('.action-col');
        actionCol[0].classList.remove('action-col');
        dataTable.order([1, 'desc']).draw();

        $.ajax({
            url: '/quan-ly/san-pham/ModalSize',
            type: 'GET',
            success: function (response) {
                $('#aoe-size-modal').html(response);
            },
            error: function () {
                $.notify("Kết nối đến máy chủ bị lỗi", {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
        });
    },
    readyToAdd: function () {
        var cardElements = document.querySelectorAll('.card');
        cardElements[1].style.display = 'none';
        cardElements[2].style.display = 'none';
        $('#top-page-alert').css('display', 'block');
        $('#btn-save-information').css('display', 'block');
        $('#btn-edit-information').css('display', 'none');
        SanPhamAOE.enableEditInformation();
        $('#MaSP').val($('#MSSP').data('id'));
        $('#MaSP').addClass('input-success-outline');
        $('#TenNCC').addClass('input-danger-outline');
        $('#TenSP').addClass('input-danger-outline');
        $('#MoTa').addClass('input-danger-outline');
        $('#MaDoiTuong').addClass('input-danger-outline');
        $('#category-dropdown').addClass('input-danger-outline');
        $('#detail-category-dropdown').prop('disabled', true).addClass('input-danger-outline');
    }
}

$(document).ready(function () {
    SanPhamAOE.init();
});

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

$.notify.addStyle('myNotify', {
    html: "<div><i class='fa fa-exclamation-triangle noti-icon' aria-hidden='true'></i><span data-notify-text/></div>",
    classes: {
        "noti-success": {
            "position": "relative",
            "padding": ".75rem 1.25rem",
            "border": "1px solid transparent",
            "border-radius": ".25rem",
            "color": "#155724",
            "background-color": "#d4edda",
            "border-color": "#c3e6cb",
            "font-weight": "bold",
            "margin-top": "1.2rem",
            "margin-right": "1.5rem",
            "z-index": "1300"
        },
        "noti-danger": {
            "position": "relative",
            "padding": ".75rem 1.25rem",
            "border": "1px solid transparent",
            "border-radius": ".25rem",
            "color": "#721c24",
            "background-color": "#f8d7da",
            "border-color": "#f5c6cb",
            "font-weight": "bold",
            "margin-top": "1.2rem",
            "margin-right": "1.5rem",
            "z-index": "1300"
        }
    }
});