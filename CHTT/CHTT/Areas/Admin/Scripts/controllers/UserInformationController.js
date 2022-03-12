var UserInformation = {
    init: function () {
        UserInformation.LoadData();
        UserInformation.registerEvent();
    },
    registerEvent: function () {
        $('#btn-edit-information').off('click').on('click', function () {
            UserInformation.ResetChangePassForm();
            $('#changepass-modal').modal('show');
            UserInformation.registerEvent();
        });

        $('#save-button').off('click').on('click', function () {
            if (UserInformation.UserChangePassValidation()) {
                UserInformation.ChangePass();
            }
            else {
                $.notify('Vui lòng kiểm tra thông tin', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className:'noti-danger'
                });
            }
            UserInformation.registerEvent();
        });

        $(document).off('click', '.close').on('click', '.close', function () {
            $('#changepass-modal').modal('hide');
            UserInformation.registerEvent();
        });


    },
    LoadData: function () {
        $.ajax({
            url: '/quan-ly/trang-chu/AccountInformationData',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var rowSelector = $('#employee-information-content tr td:last-child');
                    $(rowSelector[0]).html(response.data.MaNV);
                    $(rowSelector[1]).html(response.data.HoTen);
                    $(rowSelector[2]).html(response.data.Phai);
                    $(rowSelector[3]).html(response.userBirthDay);
                    $(rowSelector[4]).html(response.data.TenChucVu);
                    $(rowSelector[5]).html(Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(response.data.Luong));
                    $(rowSelector[6]).html(response.data.Email.length != 0 ? response.data.Email : 'Chưa có thông tin' );
                    $(rowSelector[7]).html(response.data.SoDienThoai);
                    $(rowSelector[8]).html(response.data.QueQuan);
                    $(rowSelector[9]).html(response.data.DiaChi);
                }
            }
        });

    },
    ChangePass: function () {
        $.ajax({
            url: '/quan-ly/trang-chu/UserChangePass',
            type: 'POST',
            dataType: 'json',
            data: {
                strCurPass:$('#cur-pass').val(),
                strNewPass:$('#new-pass').val()
            },
            success: function (response) {
                if (response.status) {
                    $('#changepass-modal').modal('hide');
                    $.notify('Đã đổi thành công', {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-success'
                    });
                }
                else {
                    $.notify('Thông tin chưa chính xác. Vui lòng kiểm tra lại', {
                        globalPosition: 'top right',
                        style: 'myNotify',
                        className: 'noti-danger'
                    });
                }
            }
        });
    },
    ResetChangePassForm: function () {
        var curMK = $('#cur-pass');
        var newMK = $('#new-pass');
        var newMK2 = $('#new-pass-again');

        curMK.val('').removeClass('input-danger-outline').removeClass('input-success-outline');
        newMK2.val('').removeClass('input-danger-outline').removeClass('input-success-outline');
        newMK.val('').removeClass('input-danger-outline').removeClass('input-success-outline');
    },
    UserChangePassValidation: function () {
        var curMK = $('#cur-pass');
        var newMK = $('#new-pass');
        var newMK2 = $('#new-pass-again');

        curMK.val(curMK.val().trim());
        if (curMK.val().length < 6 || curMK.val().length > 15) {
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

        if (
            newMK.hasClass('input-success-outline') &&
            newMK2.hasClass('input-success-outline')) {
            return true;
        }
        else return false;
    }
}

$(document).ready(function () {
    UserInformation.init();
});