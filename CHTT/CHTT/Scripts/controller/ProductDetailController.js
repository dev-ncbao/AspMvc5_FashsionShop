var size;
var price;
var ProductDetailController = {
    init: function () {
        ProductDetailController.loadProductData();
        ProductDetailController.registerEvent();
    },
    registerEvent: function () {
        $(document).off('change', '#cbo-size').on('change', '#cbo-size', function () {
            var value = $(this).val();
            $.each($('option'), function (i, item) {
                if ($(item).val() == value) {
                    $('.product-detail-price').html(Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format($(item).data('id')));
                }
            });
        });
    },
    loadProductData: function () {
        var strMaSP = $('#txt-MaSP').data('id');
        $.ajax({
            url: '/ProductDetail/LoadProductData',
            type: 'GET',
            dataType: 'json',
            data: {
                strMaSP: strMaSP
            },
            success: function (response) {
                if (response.status) {
                    $('.product-detail-name').html(response.information.TenSP);
                    if (response.information.MoTa != null) { $('#txt-about').html(response.information.MoTa);}
                    $.each(response.picture, function (i, item) {
                        if (i % 2 == 0) {
                            $('.img-leftside').append('<img src="' + item + '" class="img-detail">');
                            console.log('left' + i);
                        }
                        else {
                            $('.img-rightside').append('<img src="' + item + '" class="img-detail">');
                            console.log('right' + i);
                        }
                    });
             
                    $.each(response.size, function (i, item) {
                        $('#cbo-size').append('<option value='+item.Size+' data-id="'+ item.Gia +'">'+item.Size+'</option>');
                    });

                    $('#cbo-size').change();
                }
            },
            error: function(){

            }
        });
    }
}

$(document).ready(function () {
    ProductDetailController.init();
});
