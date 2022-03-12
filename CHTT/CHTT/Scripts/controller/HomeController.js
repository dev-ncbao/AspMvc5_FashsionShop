var curhotcount = 0;
var curnewcount = 0;
var totalnew = 0;
var totalhot = 0;
var HomeController = {
    init: function () {
        setTimeout(function () {
            HomeController.loadNewProductList();
            HomeController.loadHotProductList();
        },100);
        HomeController.registerEvent();
    },
    registerEvent: function () {
        $('#hot-product').off('click').on('click', function () {
            HomeController.loadHotProductList();
            HomeController.registerEvent();
        });
        $('#new-product').off('click').on('click', function () {
            HomeController.loadNewProductList();
            HomeController.registerEvent();
        });
    },
    loadNewProductList: function () {
        $.ajax({
            url: '/Home/LoadNewProductList',
            type: 'GET',
            dataType: 'json',
            data: {
                skip: curnewcount
            },
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    curnewcount = response.skip;
                    totalnew = response.total;
                    if (curnewcount < totalnew) {
                        $($('.product-category-footer')[0]).css('display', 'block');
                        $('#new-product').css('visibility', 'visible');
                    }
                    else {
                        $('#new-product').css('visibility', 'hidden');
                        $($('.product-category-footer')[0]).css('display', 'none');
                    }
                    /*$('#list-new-product .product-component-container').remove();*/
                    $.each(data, function (i, item) {
                        $('#list-new-product').append(
                            '<div class="product-component-container" data-id="' + item.MaSP + '">'+
                                '<div class="product-component">'+
                                    '<div class="product-img-container">' +
                                         '<img src="' + item.LinkAnh + '" class="product-img" />' +
                                    '</div>'+
                                    '<p class="product-name">' + item.TenSP + '</p>'+
                                    '<div class="product-box-bottom">'+
                                        '<div class="product-information-flex">'+
                                            '<p class="product-price">' + (Intl.NumberFormat('it-IT', {style: 'currency', currency: 'VND'}).format(item.GiaBan)) + '</p>'+
                                            '<p class="product-ordered">Đã bán ' + (item.DaBan == null ? '0' : item.DaBan) + '</p>'+
                                        '</div>'+
                                        '<div class="product-component-button">'+
                                            '<button class="product-detail" data-id="' + item.MaSP + '">Chi tiết</button>'+
                                            '<button class="add-to-cart" data-id="' + item.MaSP + '">Thêm vào giỏ</button>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'
                        );
                    });
                }
            },
            error: function () {

            }
        });
    },
    loadHotProductList: function () {
        $.ajax({
            url: '/Home/LoadHotProductList',
            type: 'GET',
            dataType: 'json',
            data: {
                skip: curhotcount
            },
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    curhotcount = response.skip;
                    totalhot = response.total;
                    if (curhotcount < totalhot) {
                        $($('.product-category-footer')[1]).css('display', 'block');
                        $('#hot-product').css('visibility', 'visible');
                    }
                    else {
                        $('#hot-product').css('visibility', 'hidden');
                        $($('.product-category-footer')[1]).css('display', 'none');
                    }
                    /*$('#list-hot-product .product-component-container').remove();*/
                    $.each(data, function (i, item) {
                        $('#list-hot-product').append(
                            '<div class="product-component-container" data-id="' + item.MaSP + '" >' +
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
            },
            error: function () {

            }
        });
    }
}

$(document).ready(function () {
    HomeController.init();
});