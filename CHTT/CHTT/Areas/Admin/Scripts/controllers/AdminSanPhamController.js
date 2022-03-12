var dataTable;

var sanPhamController = {
    init: function () {
        sanPhamController.loadData();
        sanPhamController.registerEvents();
        setTimeout($('.nav-item')[1].classList.add('active'), 200);
    },
    registerEvents: function () {
        $('#add-new-button').off('click').on('click', function () {
            window.location.href = '/quan-ly/san-pham/AddOrEdit';
        });

        $(document).off('click', '.edit-button').on('click', '.edit-button', function () {
            var strID = $(this).data('id');
            window.location.href = '/quan-ly/san-pham/chi-tiet/?strID=' + strID;
        });

        /*$(document).off('click', '.delete-button').on('click', '.delete-button', function () {
            alert(1);
        });*/
    },
    loadData: function() {
        dataTable = $('#SanPhamTable').DataTable({
            "ajax": {
                "url": "/quan-ly/san-pham/LoadIndexData",
                "type": "GET",
                "datatype": "json"
            },
            columns: [
                { "data": 'MaSP' },
                { "data": 'TenNCC' },
                {
                    "data": 'TenSP',
                    width:'350px'
                },
                {
                    "data": 'Link',
                    "render": function (data) {
                        if (data == null) {
                            return "Chưa có";
                        }
                        else {
                            return "<img src='" + data + "' class='picture-represent-column'/>";
                        }
                    }
                },
                {
                    "data": 'TenDoiTuong'
                },
                {
                    "data": 'SoLuong',
                    "render": function (data) {
                        if (data > 0) {
                            return "Còn hàng";
                        }
                        if (data == null) {
                            return "Chưa có hàng";
                        }
                        else return "Hết hàng";
                    }
                },
                {
                    "data": 'MaSP',
                    width: '124px',
                    "render": function (data) {
                        return "<button class='btn btn-primary edit-button'  data-id='" + data + "'><i class='fa fa-wrench' style='margin-right:.3rem' aria-hidden='true'></i>Chi tiết</button>";
                            /*"<button class='btn btn-danger delete-button'  data-id='" + data + "'><i class='fa fa-trash' style='margin-right:.3rem' aria-hidden='true'></i>Xóa</button>";*/
                    },
                    "orderable": false,
                    "className": 'action-col'
                }
            ],
            "lengthMenu": [[20, -1], [20, "Tất cả"]],
            "language": {
                sInfoFiltered: "",
                sInfoEmpty: "",
                sInfo: "Tổng số _TOTAL_ sản phẩm",
                sEmptyTable: "Không có dữ liệu, Vui lòng <b>Thêm</b> sản phẩm",
                sLengthMenu: "Hiển thị  _MENU_ sản phẩm/ Trang",
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
        document.getElementsByClassName('action-col')[0].classList.remove('action-col');
    }
}

$(document).ready(function () {
    sanPhamController.init();
});