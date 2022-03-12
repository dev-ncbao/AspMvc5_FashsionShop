var curcount = 0;
var total = 0;
var ProductByCategory = {
    init: function () {
        ProductByCategory.loadProductListByCategory();
        ProductByCategory.registerEvent();
    },
    registerEvent: function () {
        /*$(document).off('click', '.product-component-container').on('click', '.product-component-container', function () {
            var strMaSP = $(this).data('id');
            location.href = '/ProductDetail/Index/?strMaSP=' + strMaSP;
            $('.product-component-container').preventDefault();
            HomeController.registerEvent();
        });

        $(document).off('click', '.product-detail').on('click', '.product-detail', function () {
            var strMaSP = $(this).data('id');
            location.href = '/ProductDetail/Index/?strMaSP=' + strMaSP;
            $('.product-component-container').preventDefault();
            HomeController.registerEvent();
        });

        $(document).off('click', '.add-to-cart').on('click', '.add-to-cart', function () {
            alert(2);
            $('.product-component-container').preventDefault();
            HomeController.registerEvent();
        });*/
        $('#list-product-append').off('click').on('click', function () {
            ProductByCategory.loadProductListByCategory();
            ProductByCategory.registerEvent();
        });
    },
    loadProductListByCategory: function () {
        $.ajax({
            url: '/Home/LoadListProductByCategory',
            type: 'GET',
            dataType: 'json',
            data: {
                strMaLoai: $('#txt-MaLoai').data('id'),
                skip: curcount
            },
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var data = response.data;
                    curcount = response.skip;
                    total = response.total;
                    if (curcount < total) {
                        $('.product-category-footer').css('display', 'block');
                        $('#list-product-append').css('visibility', 'visible');
                    }
                    else {
                        $('#list-product-append').css('visibility', 'hidden');
                        $('.product-category-footer').css('display', 'none');
                    }
                    /*$('.category-title').html(response.tenloai);*/
                    if (data.length != 0) {
                        if ($('#list-product').hasClass('have-no-product')) {
                            $('#list-product').removeClass('have-no-product');
                            $('#list-product p').remove();
                        }
                        $.each(data, function (i, item) {
                            $('#list-product').append(
                                '<div class="product-component-container" data-id="' + item.MaSP + '">' +
                                '<div class="product-component">' +
                                '<div class="product-img-container">' +
                                '<img src="' + item.LinkAnh + '" class="product-img" />' +
                                '</div>' +
                                '<p class="product-name">' + item.TenSP + '</p>' +
                                '<div class="product-box-bottom">' +
                                '<div class="product-information-flex">' +
                                '<p class="product-price">' + (Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(item.GiaBan)) + '</p>' +
                                '<p class="product-ordered">Đã bán ' + (item.DaBan == null ? '0' : item.DaBan) + '</p>' +
                                '</div>' +
                                '<div class="product-component-button">' +
                                '<button class="product-detail" data-id="' + item.MaSP + '">Chi tiết</button>' +
                                '<button class="add-to-cart" data-id="' + item.MaSP + '">Thêm vào giỏ</button>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                            );
                        });
                    }
                    else {
                        /*$('#list-product').append(
                            '<p>Hiện tại không có sản phẩm nào</p>'
                        ).addClass('have-no-product')*/
                    }
                }
            },
            error: function () {

            }
        });
    }
}

$(document).ready(function () {
    ProductByCategory.init();
});