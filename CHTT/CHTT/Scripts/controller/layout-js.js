var btnATCClick = false;
var ATCSPId = "";
var userName = null;
var LayoutControl = {
    init: function () {
        
        LayoutControl.registerEvent();
        //LayoutControl.getRegisterModal();
        LayoutControl.getAddToCartModal();
        LayoutControl.getShoppingCartModal();
        LayoutControl.getLopassModal();
//        LayoutControl.getChangepassModal();
        /*LayoutControl.getCustomerName();*/
        if (userName != null) {
            LayoutControl.getUserInformationModal();
        }
    },
    registerEvent: function () {
        $(document).off('click', '#btn-product .dropdown-item').on('click', '#btn-product .dropdown-item', function () {
            var id = $(this).data('id');
            location.href = '/Home/ProductByCategory/?strMaLoai=' + id;
            LayoutControl.registerEvent();
        });

        $(document).off('change', '.spc-sl-control').on('change', '.spc-sl-control', function () {
            /*alert(1);*/
            var strMaSP = $(this).data('id');
            var strSize = $(this).data('size');
            var strSoluong = $(this).val();
            console.log(strSoluong);
            LayoutControl.updateItemAmountOnSPC(strSize, strMaSP, strSoluong);
            LayoutControl.registerEvent();
        });

        $('#btn-home').off('click').on('click', function () {
            location.href = '/Home/Index';
            LayoutControl.registerEvent();
        });

        $('#btn-search').off('click').on('click', function () {
            var dataText = $('#txt-search').val();
            if (dataText.length != 0) {
                location.href = '/Home/ProductBySearch/?strSearchString=' + dataText;
            }
            LayoutControl.registerEvent();
        });

        $('#btn-sale').off('click').on('click', function () {
            location.href = '/khuyen-mai';
            LayoutControl.registerEvent();
        });

        $(document).off('click', '.product-component-container').on('click', '.product-component-container', function () {
            if (!btnATCClick) {
                var strMaSP = $(this).data('id');
                location.href = '/ProductDetail/Index/?strMaSP=' + strMaSP;
                LayoutControl.registerEvent();
            } else {
                btnATCClick = false;
            }
        });

        $('#btn-add-to-cart').off('click').on('click', function () {
            if (LayoutControl.checkLogin()) {
                LayoutControl.submitAddToCart();
            }
            else {
                $.notify('Bạn phải đăng nhập mới có thể thêm vào giỏ hàng', {
                    globalPosition: 'top left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
            LayoutControl.registerEvent();
        });

        $(document).off('click', '.product-detail').on('click', '.product-detail', function () {
            var strMaSP = $(this).data('id');
            location.href = '/ProductDetail/Index/?strMaSP=' + strMaSP;
            LayoutControl.registerEvent();
        });

        $(document).off('click', '.add-to-cart').on('click', '.add-to-cart', function () {
            btnATCClick = true;
            if ($('#atc-container > div').length > 0) {
                ATCSPId = $(this).data("id");
                LayoutControl.getListSizeOfSelectProduct(ATCSPId);
                $('#atc-sl-control').val(1);
                $('#page-backdrop').addClass('page-backdrop-active');
                $('#atc-modal-container').addClass('atc-modal-active');
                LayoutControl.registerEvent();
            }
            else {
                $.notify('Chức năng đang được tải. Vui lòng thử lại', {
                    globalPosition: 'top left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
        });

        $('#btn-atc').off('click').on('click', function () {
            if (LayoutControl.checkLogin()) {
                LayoutControl.submitAddToCartForm();
            }
            else {
                $.notify('Bạn phải đăng nhập mới có thể thêm vào giỏ hàng', {
                    globalPosition: 'top left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
            LayoutControl.registerEvent();
        });

        $('#btn-close-atc').off('click').on('click', function () {
            $('#page-backdrop').removeClass('page-backdrop-active');
            $('#atc-modal-container').removeClass('atc-modal-active');
            btnATCClick = false;
            LayoutControl.registerEvent();
        });

        $('#btn-close-register').off('click').on('click', function () {
            $('#page-backdrop').removeClass('page-backdrop-active');
            $('#register-modal-container').removeClass('register-modal-active');
            LayoutControl.registerEvent();
        });

        $(document).off('change', '#atc-size-control').on('change', '#atc-size-control', function () {
            var value = $(this).val();
            $.each($('option'), function (i, item) {
                if ($(item).val() == value) {
                    $('#atc-modal-container .product-detail-price').html(Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format($(item).data('id')));
                }
            });
        });

        $(document).off('click', '.carousel-item a').on('click', '.carousel-item a', function () {
            $.notify('Chức năng này đang cập nhật', {
                globalPosition: 'top left',
                style: 'myNotify',
                className: 'noti-main'
            });
        });

        $('#btn-shopping-cart').off('click').on('click', function () {
            if (LayoutControl.checkLogin()) {
                LayoutControl.getShoppingCartData();
                if ($('#spc-container > div').length > 0) {
                    /*LayoutControl.getShoppingCartData();
                setTimeout(function () {*/
                    $('#page-backdrop').addClass('page-backdrop-active');
                    $('#spc-modal-container').addClass('spc-modal-active');
                    /*}, 400);*/
                }
                else {
                    $.notify('Giỏ hàng của bạn đang được tải xuống. Vui lòng thử lại sau', {
                        globalPosition: 'top-left',
                        style: 'myNotify',
                        className: 'noti-main'
                    });
                }
            }
            else {
                $.notify('Bạn cần phải đăng nhập để sử dụng chức năng này', {
                    globalPosition: 'top-left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
            LayoutControl.registerEvent();
        });

        $('#btn-user-login').off('click').on('click', function () {
            LayoutControl.resetLoginForm();
            $('#page-backdrop').addClass('page-backdrop-active');
            $('#login-modal-container').addClass('login-modal-active');
            LayoutControl.registerEvent();
        });

        $('#btn-login').off('click').on('click', function () {
            LayoutControl.submitLoginForm();
            LayoutControl.registerEvent();
        });

        $('#btn-close-login').off('click').on('click', function () {
            $('#page-backdrop').removeClass('page-backdrop-active');
            $('#login-modal-container').removeClass('login-modal-active');
            LayoutControl.registerEvent();
        });

        $('#btn-close-spc').off('click').on('click', function () {
            $('#page-backdrop').removeClass('page-backdrop-active');
            $('#spc-modal-container').removeClass('spc-modal-active');
            LayoutControl.registerEvent();
        });

        $('#txt-search').keypress(function (e) {
            if (e.which == 13 && $(this).val().length != 0) {
                $('#btn-search').click();
            }
            LayoutControl.registerEvent();
        });


        $('#btn-register').off('click').on('click', function () {
            if (LayoutControl.registerValidation()) {
                LayoutControl.submitRegisterForm(true);
            }
            else {
                $.notify('Vui lòng kiểm tra lại thông tin', {
                    globalPosition: 'top-left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
            LayoutControl.registerEvent();
        });

        $('#btn-order').off('click').on('click', function () {
            if ($($('#list-order-product > div')).hasClass('have-no-order')) {
                $.notify('Giỏ hàng của bạn đang trống', {
                    globalPosition: 'top-left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
            else {
                LayoutControl.orderAllItemOnSPC();
            }
            LayoutControl.registerEvent();
        });


        $('#btn-changepass').off('click').on('click', function () {
            if (LayoutControl.changePassValidation()) {
                LayoutControl.submitChangePassForm();
            }
            else {
                $.notify('Thông tin không hợp lệ hoặc không trùng khớp. Vui lòng kiểm tra lại', {
                    globalPosition: 'top-left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
            LayoutControl.registerEvent();
        });

        $('#btn-close-changepass').off('click').on('click', function () {
            $('#page-backdrop').removeClass('page-backdrop-active');
            $('#changepass-modal-container').removeClass('changepass-modal-active');
            LayoutControl.registerEvent();
        });

        $('#btn-logout').off('click').on('click', function () {
            LayoutControl.logout();
            LayoutControl.registerEvent();
        });

        $('#btn-change-pass').off('click').on('click', function () {
            LayoutControl.resetChagepassForm();
            $('#page-backdrop').addClass('page-backdrop-active');
            $('#changepass-modal-container').addClass('changepass-modal-active');
            LayoutControl.registerEvent();
        });

        $('#btn-user-information').off('click').on('click', function () {
            if ($('#ui-container > div').length > 0) {
                /*LayoutControl.getShoppingCartData();
            setTimeout(function () {*/
                $('#page-backdrop').addClass('page-backdrop-active');
                $('#ui-modal-container').addClass('ui-modal-active');
                /*}, 400);*/
            }
            else {
                $.notify('Thông tin của bạn đang được tải xuống. Vui lòng thử lại sau', {
                    globalPosition: 'top-left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
                LayoutControl.getUserInformationModal();
            }
            LayoutControl.registerEvent();
        });

        $('#btn-ui').off('click').on('click', function () {
            LayoutControl.submitUserInformationForm();
            LayoutControl.registerEvent();
        });

        $(document).off('click', '.order-product-delete').on('click', '.order-product-delete', function () {
            var strSize = $(this).data('size');
            var strMaSP = $(this).data('id');
            LayoutControl.deleteProductOnSPC(strSize, strMaSP);
            LayoutControl.registerEvent();
        });

        $('#btn-lopass').off('click').on('click', function () {
            LayoutControl.submitLopassForm();
            LayoutControl.registerEvent();
        });

        $('#btn-close-lopass').off('click').on('click', function () {
            $('#page-backdrop').removeClass('page-backdrop-active');
            $('#lopass-modal-container').removeClass('lopass-modal-active');
            LayoutControl.registerEvent();
        });

        $('#btn-order-history').off('click').on('click', function () {
            $.notify('Chức năng này đang cập nhật. Vui lòng quay lại sau', {
                globalPosition: 'top-left',
                style: 'myNotify',
                className: 'noti-main'
            });
            LayoutControl.registerEvent();
        });

        $('#btn-close-lopass').off('click').on('click', function () {
            $('#page-backdrop').removeClass('page-backdrop-active');
            $('#lopass-modal-container').removeClass('lopass-modal-active');
            LayoutControl.registerEvent();
        });

        $('#btn-close-ui').off('click').on('click', function () {
            $('#page-backdrop').removeClass('page-backdrop-active');
            $('#ui-modal-container').removeClass('ui-modal-active');
            LayoutControl.registerEvent();
        });
        $('#btn-forgot-pass').off('click').on('click', function () {

            LayoutControl.resetLopassForm();
            $('#login-modal-container').removeClass('login-modal-active');
            $('#lopass-modal-container').addClass('lopass-modal-active');
            LayoutControl.registerEvent();
        });

        $('#btn-register-account').off('click').on('click', function () {
            LayoutControl.resetRegisterForm();
            LayoutControl.getNextCustomerID();
            $('#PhaiNam').prop('checked', true);
            $('#login-modal-container').removeClass('login-modal-active');
            $('#register-modal-container').addClass('register-modal-active');
            LayoutControl.registerEvent();
        });

    },
    orderAllItemOnSPC: function () {
        $.ajax({
            url: '/Home/Order',
            type: 'POST',
            data: {
                strGhiChu: $('#customer-note').val()
            },
            success: function (response) {
                if (response.status) {
                    $('#btn-close-spc').click();
                    $.notify('Đơn hàng đã được gửi đi. Cảm ơn bạn đã ủng hộ', {
                        globalPosition: 'top-left',
                        style: 'myNotify',
                        className: 'noti-main'
                    });
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi kết nối Server. Vui lòng tải lại trang', {
                    globalPosition: 'top-left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
        });
    },
    updateItemAmountOnSPC: function (strSize, strMaSP, strSoluong) {
        $.ajax({
            url: '/Home/UpdateItemAmountOnSPC',
            type: 'POST',
            data: {
                strSize: strSize,
                strMaSP: strMaSP,
                strSoluong: strSoluong
            },
            success: function (response) {
                if (response.status) {
                    $('.frm-spc-button .order-total').remove();
                    $('.frm-spc-button').prepend(
                        '<div class="order-total">' +
                        '<p>Tổng thanh toán: ' + Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(response.total) + '</p>' +
                        '<p>Số sản phẩm: ' + response.totalamount + '</p>' +
                        '</div>'
                    );
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi kết nối Server. Vui lòng tải lại trang', {
                    globalPosition: 'top-left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
        });
    },
    deleteProductOnSPC: function (strSize, strMaSP) {
        $.ajax({
            url: '/Home/DeleteProductOnSPC',
            type: 'POST',
            data: {
                strSize: strSize,
                strMaSP: strMaSP
            },
            success: function (response) {
                if (response.status) {
                    if (response.totalamount == 0) {
                        $('#list-order-product').empty();
                        $('.frm-spc-button .order-total').remove();
                        $('#list-order-product').append(
                            '<div class="have-no-order">' +
                            '<p>Giỏ hàng của bạn đang trống</p>' +
                            '</div>'
                        );
                    }
                    else {
                        $.each($('#list-order-product .order-product'), function (i, item) {
                            var Size = $(item).data('size');
                            var MaSP = $(item).data('id');
                            if (Size == strSize && MaSP == strMaSP) {
                                $($('#list-order-product .order-product')[i]).remove();
                                return;
                            }
                        });
                        $('.frm-spc-button .order-total').remove();

                        $('.frm-spc-button').prepend(
                            '<div class="order-total">' +
                            '<p>Tổng thanh toán: ' + Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(response.total) + '</p>' +
                            '<p>Số sản phẩm: ' + response.totalamount + '</p>' +
                            '</div>'
                        );
                    }
                    $.notify('Đã xóa khỏi giỏ hàng', {
                        globalPosition: 'top-left',
                        style: 'myNotify',
                        className: 'noti-main'
                    });
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi kết nối Server', {
                    globalPosition: 'top-left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
        });
    },
    getListSizeOfSelectProduct: function (strMaSP) {
        $.ajax({
            url: '/Home/GetListSizeOfSelectProduct',
            type: 'GET',
            dataType: 'json',
            data: {
                strMaSP: strMaSP
            },
            success: function (response) {
                if (response.status) {
                    $('#atc-modal-container .product-detail-name').html(response.name);
                    $('#atc-size-control').empty();
                    $.each(response.size, function (i, item) {
                        $('#atc-size-control').append('<option value=' + item.Size + ' data-id="' + item.Gia + '">' + item.Size + '</option>');
                    });

                    $('#atc-size-control').change();
                }
            },
            error: function () {

            }
        });
    },
    getShoppingCartData: function () {
        $.ajax({
            url: '/AccountLogin/GetShoppingCart',
            type: 'GET',
            success: function (response) {
                if (response.status) {
                    if (response.totalamount == 0) {
                        $('#list-order-product').empty();
                        $('.frm-spc-button .order-total').remove();
                        $('#list-order-product').append(
                            '<div class="have-no-order">' +
                            '<p>Giỏ hàng của bạn đang trống</p>' +
                            '</div>'
                        );
                    } else {
                        $('#list-order-product').empty();
                        $('.frm-spc-button .order-total').remove();
                        var data = response.data;
                        $('.frm-spc-button').prepend(
                            '<div class="order-total">' +
                            '<p>Tổng thanh toán: ' + Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(response.total) + '</p>' +
                            '<p>Số sản phẩm: ' + response.totalamount + '</p>' +
                            '</div>'
                        );
                        $.each(data, function (i, item) {
                            $('#list-order-product').append(
                                '<div class="order-product" data-size="' + item.Size + '" data-id="' + item.MaSP + '">' +
                                '<div class="order-product-img">' +
                                '<img src="' + item.LinkAnh + '" />' +
                                '</div>' +
                                '<div class="order-product-information">' +
                                '<div class="order-information-container">' +
                                '<p class="order-product-name">' + item.TenSP + '</p>' +
                                '<p class="order-product-price">' + Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(item.GiaBan) + '</p>' +
                                '<p class="order-product-size">Size: ' + item.Size + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="order-product-amount">' +
                                '<div class="order-product-sl-container">' +
                                '<button class="minus-button" onclick="spcminus(this)">&minus;</button>' +
                                '<input type="number" min="1" max="500" value="' + item.Soluong + '" class="spc-sl-control" data-size="' + item.Size + '" data-id="' + item.MaSP + '"/> ' +
                                '<button class="plus-button" onclick="spcplus(this)">&plus;</button>' +
                                '</div>' +
                                '</div>' +
                                '<div class="order-product-feature">' +
                                '<div class="order-product-button">' +
                                '<button class="order-product-delete form-control" data-size="' + item.Size + '" data-id="' + item.MaSP + '">Xóa</button>' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                            );
                        });
                        $('#list-order-product').append(
                            '<div class="customer-note-container">' +
                            '<input type="text" id="customer-note" placeholder="Ghi chú lại cho cửa hàng." class="form-control"/>' +
                            '</div>'
                        );
                    }
                }
            },
            error: function () {

            }
        });
    },
    submitAddToCart: function () {
        var model = {
            MaSP: $('#txt-MaSP').data('id'),
            Size: $('#cbo-size').val(),
            Soluong: $('#num-amount').val()
        }
        $.ajax({
            url: '/Home/AddToCart',
            type: 'POST',
            dataType: 'json',
            data: {
                model: model
            },
            success: function (response) {
                if (response.status) {
                    /*$('#btn-close-atc').click();*/
                    /*LayoutControl.getShoppingCartData();*/
                    $.notify('Đã thêm sản phẩm vào giỏ hàng', {
                        globalPosition: 'top-left',
                        style: 'myNotify',
                        className: 'noti-main'
                    });
                }
                else {
                    if (response.exists) {
                        $.notify('Sản phẩm này đã có trong giỏ của bạn', {
                            globalPosition: 'top-left',
                            style: 'myNotify',
                            className: 'noti-main'
                        });
                    }
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi kết nối Server', {
                    globalPosition: 'top-left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
        });
    },
    submitAddToCartForm: function () {
        var model = {
            MaSP: ATCSPId,
            Size: $('#atc-size-control').val(),
            Soluong: $('#atc-sl-control').val()
        }
        $.ajax({
            url: '/Home/AddToCart',
            type: 'POST',
            dataType: 'json',
            data: {
                model: model
            },
            success: function (response) {
                if (response.status) {
                    $('#btn-close-atc').click();
                    /*LayoutControl.getShoppingCartData();*/
                    $.notify('Đã thêm sản phẩm vào giỏ hàng', {
                        globalPosition: 'top-left',
                        style: 'myNotify',
                        className: 'noti-main'
                    });
                }
                else {
                    if (response.exists) {
                        $.notify('Sản phẩm này đã có trong giỏ của bạn', {
                            globalPosition: 'top-left',
                            style: 'myNotify',
                            className: 'noti-main'
                        });
                    }
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi kết nối Server', {
                    globalPosition: 'top-left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
        });
    },
    submitLoginForm: function () {
        $.ajax({
            url: '/AccountLogin/Login',
            type: 'POST',
            dataType: 'json',
            data: {
                strTK: $('#tk-control').val(),
                strMK: $('#mk-control').val()
            },
            success: function (response) {
                if (response.status) {
                    userName = response.name;
                    LayoutControl.bindDataLogin();
                    $('#btn-close-login').click();
                    $.notify('Chào mừng bạn trở lại với MODERN SHOP', {
                        globalPosition: 'top-left',
                        style: 'myNotify',
                        className: 'noti-main'
                    });

                    LayoutControl.getUserInformationModal();

                }
                else {
                    $.notify('Tài khoản hoặc mật khẩu không đúng', {
                        globalPosition: 'top-left',
                        style: 'myNotify',
                        className: 'noti-main'
                    });
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi kết nối Server', {
                    globalPosition: 'top-left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
        });
    },
    submitChangePassForm: function () {
        $.ajax({
            url: '/AccountLogin/ChangePassword',
            type: 'POST',
            dataType: 'json',
            data: {
                strCurMK: $('#mk-changepass-control').val(),
                strNewMK: $('#mk2-changepass-control').val()
            },
            success: function (response) {
                if (response.status) {
                    $('#btn-close-changepass').click();
                    $.notify('Mật khẩu của bạn đã được đổi thành công', {
                        globalPosition: 'top-left',
                        style: 'myNotify',
                        className: 'noti-main'
                    });
                }
                else {
                    $.notify('Mật khẩu hiện tại của bạn chưa đúng', {
                        globalPosition: 'top-left',
                        style: 'myNotify',
                        className: 'noti-main'
                    });
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi kết nối Server', {
                    globalPosition: 'top-left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
        });
    },
    logout: function () {
        $.ajax({
            url: '/AccountLogin/Logout',
            type: 'GET',
            success: function (response) {
                LayoutControl.getCustomerName();
                if (response.status) {
                    $.notify('Hẹn gặp lại bạn', {
                        globalPosition: 'top-left',
                        style: 'myNotify',
                        className: 'noti-main'
                    });
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi kết nối Server', {
                    globalPosition: 'top-left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
        });
    },
    resetRegisterForm: function () {
        var HoTen = $('#hoten-control');
        var NgaySinh = $('#ngaysinh-control');
        var SDT = $('#sdt-control');
        var Email = $('#email-control');
        var TK = $('#tk-register-control');
        var MK = $('#mk-register-control');
        var MK2 = $('#mkagain-control');
        var MaKH = $('#mkh-control');
        var DiaChi = $('#diachi-control');

        MaKH.removeClass('input-success-outline').removeClass('input-danger-outline');
        HoTen.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
        NgaySinh.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
        SDT.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
        Email.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
        TK.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
        DiaChi.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
        MK.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
        MK2.val('').removeClass('input-success-outline').removeClass('input-danger-outline');
        $('#PhaiNam').prop('checked', true);
    },
    resetLoginForm: function () {
        $('#tk-control').val('');
        $('#mk-control').val('');
    },
    resetLopassForm: function () {
        $('#tk-lopass-control').val('');
        $('#sdt-lopass-control').val('');
    },
    resetChagepassForm: function () {
        $('#mk-changepass-control').val('').removeClass('input-success-outline').removeClass('input-danger-outline');;
        $('#mk2-changepass-control').val('').removeClass('input-success-outline').removeClass('input-danger-outline');;
        $('#mk2again-changepass-control').val('').removeClass('input-success-outline').removeClass('input-danger-outline');;
    },
    submitLopassForm: function () {

        $.ajax({
            url: '/AccountLogin/LostPassword',
            type: 'POST',
            dataType: 'json',
            data: {
                strTK: $('#tk-lopass-control').val(),
                strSDT: $('#sdt-lopass-control').val()
            },
            success: function (response) {
                if (response.status) {
                    $('#btn-close-lopass').click();
                    $.notify('Hệ thống sẽ kiểm tra và gửi thông tin qua số điện thoại của bạn', {
                        globalPosition: 'top-left',
                        style: 'myNotify',
                        className: 'noti-main'
                    });
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi kết nối Server', {
                    globalPosition: 'top-left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
        });
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
                        globalPosition: 'top-left',
                        style: 'myNotify',
                        className: 'noti-main'
                    });
                }
            },
            error: function (response) {
                console.log(response);
                $.notify('Đã xảy ra lỗi kết nối Server', {
                    globalPosition: 'top-left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
        });
    },
    submitRegisterForm: function (isAdd) {
        var HoTen = $('#hoten-control');
        var NgaySinh = $('#ngaysinh-control');
        var SDT = $('#sdt-control');
        var Email = $('#email-control');
        var TK = $('#tk-register-control');
        var DiaChi = $('#diachi-control');
        var MK = $('#mk-register-control');
        var MaKH = $('#mkh-control');
        var Phai = $('#PhaiNam').prop('checked') ? "Nam" : "Nữ";
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
            KichHoat: 1
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
                    if (isAdd) {
                        $('#btn-close-register').click();
                        $.notify('Đăng ký tài khoản thành công', {
                            globalPosition: 'top-left',
                            style: 'myNotify',
                            className: 'noti-main'
                        });
                    }
                    else {
                        $.notify('Cập nhật thông tin thành công', {
                            globalPosition: 'top-left',
                            style: 'myNotify',
                            className: 'noti-main'
                        });
                    }
                }
                else {
                    $.notify(response.message, {
                        globalPosition: 'top-left',
                        style: 'myNotify',
                        className: 'noti-main'
                    });
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi', {
                    globalPosition: 'top-left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
        });
    },
    submitUserInformationForm: function () {
        var HoTen = $('#ui-hoten-control');
        var NgaySinh = $('#ui-ngaysinh-control');
        var SDT = $('#ui-sdt-control');
        var Email = $('#ui-email-control');
        var TK = $('#ui-tk-control');
        var DiaChi = $('#ui-diachi-control');
        var Phai = $('#ui-PhaiNam').prop('checked') ? "Nam" : "Nữ";
        model = {
            HoTen: HoTen.val(),
            NgaySinh: NgaySinh.val(),
            Phai: Phai,
            SoDienThoai: SDT.val(),
            DiaChi: DiaChi.val(),
            TaiKhoan: TK.val(),
            Email: Email.val()
        }

        $.ajax({
            url: '/AccountLogin/UpdateInformation',
            type: 'POST',
            dataType: 'json',
            data: {
                model: model
            },
            success: function (response) {
                if (response.status) {
                    $('#btn-close-ui').click();
                    $.notify('Cập nhật thông tin thành công', {
                        globalPosition: 'top-left',
                        style: 'myNotify',
                        className: 'noti-main'
                    });
                }
                else {
                    $.notify('Đã xảy ra lỗi. Cập nhật thất bại', {
                        globalPosition: 'top-left',
                        style: 'myNotify',
                        className: 'noti-main'
                    });
                }
            },
            error: function () {
                $.notify('Đã xảy ra lỗi', {
                    globalPosition: 'top-left',
                    style: 'myNotify',
                    className: 'noti-main'
                });
            }
        });
    },
    registerValidation: function () {
        var MaKH = $('#mkh-control');
        var HoTen = $('#hoten-control');//
        var NgaySinh = $('#ngaysinh-control');//
        var SDT = $('#sdt-control');//
        var Email = $('#email-control');//
        var TK = $('#tk-register-control');//
        var DiaChi = $('#diachi-control');//
        var MK = $('#mk-register-control');//
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
        if (MK.val().length < 6 || MK.val().length > 15) {
            MK.addClass('input-danger-outline');
            MK.removeClass('input-success-outline');
        }
        else {
            MK.addClass('input-success-outline');
            MK.removeClass('input-danger-outline');
        }

        MK2.val(MK2.val().trim());
        if (MK2.val().length < 6 || MK2.val().length > 15 || MK.hasClass('input-danger-outline') || MK.val() != MK2.val()) {
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
    changePassValidation: function () {
        var curMK = $('#mk-changepass-control')
        var newMK = $('#mk2-changepass-control');//
        var newMK2 = $('#mk2again-changepass-control');

        curMK.val(curMK.val().trim());
        if (curMK.val().length == 0) {
            curMK.addClass('input-danger-outline');
            curMK.removeClass('input-success-outline');
        }
        else {
            curMK.addClass('input-success-outline');
            curMK.removeClass('input-danger-outline');
        }

        newMK.val(newMK.val().trim());
        if (newMK.val().length < 6 || newMK.val().length > 15) {
            newMK.addClass('input-danger-outline');
            newMK.removeClass('input-success-outline');
        }
        else {
            newMK.addClass('input-success-outline');
            newMK.removeClass('input-danger-outline');
        }

        newMK2.val(newMK2.val().trim());
        if (newMK2.val().length < 6 || newMK2.val().length > 15 || newMK.hasClass('input-danger-outline') || newMK.val() != newMK2.val()) {
            newMK2.addClass('input-danger-outline');
            newMK2.removeClass('input-success-outline');
        }
        else {
            newMK2.addClass('input-success-outline');
            newMK2.removeClass('input-danger-outline');
        }

        if (newMK.hasClass('input-success-outline') &&
            newMK2.hasClass('input-success-outline') &&
            curMK.hasClass('input-success-outline')) {
            return true;
        }
        else return false;
    },
    getLopassModal: function () {
        $.ajax({
            url: '/AccountLogin/LostPassword',
            type: 'GET',
            success: function (response) {
                $('#lopass-container').html(response);
            },
            error: function () {

            }
        });
    },
    getAddToCartModal: function () {
        $.ajax({
            url: '/Home/AddToCartModal',
            type: 'GET',
            success: function (response) {
                $('#atc-container').html(response);
            },
            error: function () {

            }
        });
    },
    getShoppingCartModal: function () {
        $.ajax({
            url: '/Home/ShoppingCartModal',
            type: 'GET',
            success: function (response) {
                $('#spc-container').html(response);
            },
            error: function () {

            }
        });
    },
    getLoginModal: function () {
        $.ajax({
            url: '/AccountLogin/LoginModal',
            type: 'GET',
            success: function (response) {
                $('#login-container').html(response);
            },
            error: function () {

            }
        });
    },
    getRegisterModal: function () {
        $.ajax({
            url: '/AccountLogin/RegisterModal',
            type: 'GET',
            success: function (response) {
                $('#register-container').html(response);
            },
            error: function () {

            }
        });
    },
    getUserInformationModal: function () {
        $.ajax({
            url: '/AccountLogin/UpdateInformation',
            type: 'GET',
            success: function (response) {
                $('#ui-container').empty();
                $('#ui-container').append(response);
            },
            error: function () {

            }
        });
    },
    getChangepassModal: function () {
        $.ajax({
            url: '/AccountLogin/ChangePassword',
            type: 'GET',
            success: function (response) {
                $('#changepass-container').html(response);
            },
            error: function () {

            }
        });
    },
    loadProductDropdown: function () {
        $.ajax({
            url: '/Home/LoadProductDropdown',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('.product-menu-dropdown .menu-dropdown li').remove();
                    $.each(response.data, function (i, item) {
                        $('.product-menu-dropdown .menu-dropdown').append('<li class="dropdown-item" data-id="' + item.MaLoai + '">' + item.TenLoai + '</li>');
                    });
                }
            },
            error: function () {

            }
        });
    },
    getCustomerName: function () {
        $.ajax({
            url: '/AccountLogin/GetCustomerName',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    userName = response.data;
                    LayoutControl.bindDataLogin();
                    /*if (userName != null) {
                        LayoutControl.getUserInformationModal();
                        *//*LayoutControl.getShoppingCartData();*//*
                }*/
                }
            },
            error: function () {

            }
        });
    },
    checkLogin: function () {
        if (userName != null) {
            return true;
        }
        else {
            /*$.notify('Phiên đăng nhập đã hết hạn. Vui lòng làm mới lại trang', {
                globalPosition: 'top-left',
                style: 'myNotify',
                className: 'noti-main'
            });*/
            return false;
        }
    },
    bindDataLogin: function () {
        if (LayoutControl.checkLogin()) {
            $('#btn-user span').html(userName);
            $($('.user-menu-dropdown')[1]).fadeOut(200);
            setTimeout(function () { $($('.user-menu-dropdown')[0]).fadeIn(200); }, 300);
        }
        else {
            $($('.user-menu-dropdown')[0]).fadeOut(200);
            setTimeout(function () {
                $($('.user-menu-dropdown')[1]).fadeIn(200);
            }, 300);
        }
    }

}

LayoutControl.loadProductDropdown();
LayoutControl.getLoginModal();
LayoutControl.getChangepassModal();
LayoutControl.getRegisterModal();

$(document).ready(function () {
    LayoutControl.init();
});

function plus() {
    var input = document.querySelector('#atc-sl-control');
    if (parseInt(input.value) < 499) {
        input.value = parseInt(input.value) + 1;
    }
}

function minus() {
    var input = document.querySelector('#atc-sl-control');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function spcplus(selector) {
    var input = $(selector).siblings('.spc-sl-control');
    if (parseInt(input.val()) < 499) {
        input.val(parseInt(input.val()) + 1);
        input.change();
    }
}

function spcminus(selector) {
    var input = $(selector).siblings('.spc-sl-control');
    if (parseInt(input.val()) > 1) {
        input.val(parseInt(input.val()) - 1);
        input.change();
    }
}

if (window.history.replaceState) {
    history.replaceState(null, null, location.href);
}

$.notify.addStyle('myNotify', {
    html: "<div><span data-notify-text/></div>",
    classes: {
        "noti-main": {
            "position": "relative",
            "padding": ".75rem 1.25rem",
            "border-radius": "4.7px",
            "color": "rgb(78,115,233)",
            "background": "rgba(255,255,255)",
            /*"background": "-webkit-linear-gradient(75deg, #415ae6, #a782e6)",*/
            "border": "none",
            "box-shadow": "0 0 4px 1.5px rgba(0,0,0,0.2)",
            "font-weight": "500",
            "margin-top": "1.6rem",
            "margin-left": "1.5rem",
            "z-index": "1300",
            "font-family": "system-ui",
            "font-size": "15px"
        }
    }
});

setTimeout(LayoutControl.getCustomerName(), 300000);