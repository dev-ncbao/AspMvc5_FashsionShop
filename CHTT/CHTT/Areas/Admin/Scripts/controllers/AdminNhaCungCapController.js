var dataTable;
var NCCController = {
    init: function () {
        NCCController.loadData();
        setTimeout($('.nav-item')[6].classList.add('active'), 200);
    },
    registerEvents: function () {
        var tenncc = $('#tenncc-control');
        var diachi = $('#diachi-control');
        var sdt = $('#sdt-control');
        $(document).off('click', '.edit-button').on('click', '.edit-button', function () {
            var strID = $(this).data('id');
            NCCController.getEditData(strID);
            NCCController.registerEvents();
        });// edit form
        $(document).off('click', '.delete-button').on('click', '.delete-button', function () {
            var strID = $(this).data('id');
            if (confirm('Bạn thực sự muốn xóa nhà cung cấp \"' + strID + '\"')) {
                NCCController.deleteARecord(strID);
            }
            NCCController.registerEvents();
        });// delete a record
        $('#add-new-button').off('click').on('click', function () {
            NCCController.resetForm();
            $('.modal-title').html('THÊM NHÀ CUNG CẤP');
            $('#aoe-modal').modal('show');
            NCCController.registerEvents();
        });//add form
        $('#close-modal').off('click').on('click', function () {
            $('#aoe-modal').modal('hide');
            $('.modal-backdrop').fadeOut();
            NCCController.registerEvents();
        });//close form
        $('#reset-button').off('click').on('click', function () {
            NCCController.resetForm();
            NCCController.registerEvents();
        });// reset form
        $('#save-button').off('click').on('click', function () {
            if (NCCController.validation()) {
                NCCController.saveData();
            }
            else {
                $.notify('Vui lòng nhập đầy đủ thông tin', {
                    globalPosition: 'top right',
                    style: 'myNotify',
                    className: 'noti-danger'
                });
            }
            NCCController.registerEvents();
        });// submit form

        
    },
    validation: function () {
        var tenncc = $('#tenncc-control');
        var diachi = $('#diachi-control');
        var sdt = $('#sdt-control');
        sdt.val(sdt.val().trim());
        if (sdt.val().length >= 10 && sdt.val().length < 20 && !isNaN(parseInt(sdt.val()))) {
            sdt.addClass('input-success-outline');
            sdt.removeClass('input-danger-outline');
        }
        else {
            sdt.addClass('input-danger-outline');
            sdt.removeClass('input-success-outline');
        }
        diachi.val(diachi.val().trim());
        if (diachi.val().length > 0 && diachi.val().length < 300) {
            diachi.addClass('input-success-outline');
            diachi.removeClass('input-danger-outline');
        }
        else {
            diachi.addClass('input-danger-outline');
            diachi.removeClass('input-success-outline');
        }
        tenncc.val(tenncc.val().trim());
        if (tenncc.val().length > 0 && tenncc.val().length < 200) {
            tenncc.addClass('input-success-outline');
            tenncc.removeClass('input-danger-outline');
        }
        else {
            tenncc.addClass('input-danger-outline');
            tenncc.removeClass('input-success-outline');
        }
        if (sdt.hasClass('input-success-outline') &&
            diachi.hasClass('input-success-outline') &&
            tenncc.hasClass('input-success-outline')) {
            return true;
        }
        else {
            return false;
        }
    },
    deleteARecord: function (strID) {
        $.ajax({
            url: '/quan-ly/ncc/Delete',
            type: 'POST',
            dataType: 'json',
            data: {
                strID: strID
            },
            success: function (response) {
                if (response.status) {
                    NCCController.reloadData();
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
                alert('ajax has a problem!');
            }
        });
    },
    getEditData: function (strID) {
        var tenncc = $('#tenncc-control');
        var diachi = $('#diachi-control');
        var sdt = $('#sdt-control');
        var mancc = $('#mancc-control');

        $.ajax({
            url: '/quan-ly/ncc/AddOrEdit',
            type: 'GET',
            dataType: 'json',
            data: {
                strID: strID,
            },
            success: function (response) {
                NCCController.resetForm();
                var data = response.data;
                tenncc.val(data.TenNCC);
                mancc.val(data.MaNCC);
                diachi.val(data.DiaChi);
                sdt.val(data.SoDienThoai);
                $('.modal-title').html('CHỈNH SỬA NHÀ CUNG CẤP');
                $('#aoe-modal').modal('show');
            },
            error: function (response) {
                alert("has an error");
                console.log(response);
            }
        });
    },
    saveData: function () {
        var tenncc = $('#tenncc-control').val();
        var diachi = $('#diachi-control').val();
        var sdt = $('#sdt-control').val();
        var mancc = $('#mancc-control').val();

        var data = {
            MaNCC: mancc,
            TenNCC: tenncc,
            DiaChi: diachi,
            SoDienThoai: sdt
        }

        //console.log(data);

        $.ajax({
            url: '/quan-ly/ncc/AddOrEdit',
            type: 'POST',
            dataType: 'json',
            data: {
                strData: JSON.stringify(data)
            },
            success: function (response) {
                if (response.status) {
                    $('#aoe-modal').modal('hide');
                    $('.modal-backdrop').fadeOut();
                    NCCController.reloadData();
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
                alert('ajax has a problem!');
            }
        });
    },
    resetForm: function () {
        var tenncc = $('#tenncc-control');
        var diachi = $('#diachi-control');
        var sdt = $('#sdt-control');
        var mancc = $('#mancc-control');
        tenncc.val('');
        diachi.val('');
        sdt.val('');
        mancc.val('');
        //console.log(mancc.val())
        tenncc.removeClass('input-danger-outline');
        tenncc.removeClass('input-success-outline');
        diachi.removeClass('input-danger-outline');
        diachi.removeClass('input-success-outline');
        sdt.removeClass('input-danger-outline');
        sdt.removeClass('input-success-outline');
    },
    reloadData: function () {
        dataTable.ajax.reload(null,false);
    },
    loadData: function () {
        dataTable = $('#NCCTable').DataTable({
            "ajax": {
                "url": '/quan-ly/ncc/LoadIndexData',
                "type": 'GET',
                "datatype": 'json'
            },
            columns: [
                {
                    "data": 'MaNCC',
                    "width": "9%",
                },
                {
                    "data": 'TenNCC',
                    "width": "15%"
                },
                {
                    "data": 'DiaChi',
                    "width": "35%"
                },
                {
                    "data": 'SoDienThoai',
                    "width": "25%"
                },
                {
                    "data": 'MaNCC',
                    width: '174px',
                    "render": function (data) {
                        return "<button class='btn btn-primary edit-button'  data-id='" + data + "'><i class='fa fa-wrench' style='margin-right:.3rem' aria-hidden='true'></i>Sửa</button><button class='btn btn-danger delete-button' data-id='" + data + "'><i class='fa fa-trash' style='margin-right:.3rem' aria-hidden='true'></i>Xóa</button>";
                    },
                    "orderable": false,
                    "className": "action-col"
                }
            ],
            "lengthMenu": [[20, -1], [20, "Tất cả"]],
            "language": {
                sInfoFiltered: "Có _TOTAL_ nhà cung cấp được tìm thấy",
                sInfoEmpty: "",
                sInfo: "Tổng số _TOTAL_ nhà cung cấp",
                sEmptyTable: "Không có dữ liệu, Vui lòng <b>Thêm</b> nhà cung cấp mới",
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
        dataTable.order([0, "desc"]).draw();
        NCCController.registerEvents();
    }
}

$(document).ready(function () {
    /*var url = '/quan-ly/ncc/AOEModal';
    $.get(url)
        .done(function (response) {
            $('#aoe-container').html(response);
        });*/
    NCCController.init();
});

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

$.notify.addStyle('myNotify', {
    html: "<div><i class='fa fa-check-circle noti-icon' aria-hidden='true'></i><span data-notify-text/></div>",
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
            "z-index":"1300"
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

function callEdit(strID) {
    //var strID = $(this).data('id');
    NCCController.getEditData(strID);
     
};// edit form

/*$.notify('Hello bro', {
    globalPosition: 'top right',
    style: 'myNotify',
    className: 'noti-success'
});*/

/*function callEdit(strID) {
    //var strID = $(this).data('id');
    NCCController.getEditData(strID);
     
};// edit form*/