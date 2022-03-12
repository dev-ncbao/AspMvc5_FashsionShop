$(document).ready(function () {
    $.ajax({
        url: '/quan-ly/trang-chu/getData',
        dataType: 'json',
        type: 'GET',
        success: function (response) {
            if (response.status) {
                $('#sp-name').html(response.intSP);
                $('#kh-name').html(response.intKH);
                $('#ddm-name').html(response.intDD);
                $('#pnh-name').html(response.intPN);
            }
        },
        error: function () {
            $.notify("Lỗi kết nối đến Server", {
                globalPosition: 'top right',
                style: 'myNotify',
                className: 'noti-danger'
            });
        }
    });
    setTimeout($('.nav-item')[0].classList.add('active'), 200);
});

