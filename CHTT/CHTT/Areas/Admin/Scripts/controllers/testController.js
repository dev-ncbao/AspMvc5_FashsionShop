var testConfig = {
    pageSize: 3,
    pageIndex: 1
}

var testController = {
    init: function () {
        testController.loadData();
        testController.loadDataToDT();
    },
    registerEvent: function () {
        $('.salary-cells').off('keypress').on('keypress', function (e) {
            if (e.which == 13) {
                var id = $(this).data('id');
                var value = $(this).val();
                testController.updateSalary(id, value);
            }
        });

        $('#btnAddEmployee').off('click').on('click', function () {
            $('.modal-title').html('Add Employee');
            $('#txtID').val('-1');
            $('#txtName').val('');
            $('#txtSalary').val('');
            $('#ckbStatus').prop('checked', true);
        });

        $('#btnSave').off('click').on('click', function () {
            testController.addUpdateEmployee();
            $('#modalAddUpdate').modal('hide');
        });

        $('.btnEditEmployee').off('click').on('click', function () {
            $('.modal-title').html('Edit Employee');
            var id = parseInt($(this).data('id'));
            $('#txtID').val(id);
            testController.getDetailEmployee(id);
        });

        $('.btnDeleteEmployee').off('click').on('click', function () {
            var id = parseInt($(this).data('id'));
            var inputValue = confirm('Are you sure to delete this Employee?');
            if (inputValue) {
                testController.deleteEmployee(id);
            }
        });
    },
    deleteEmployee: function (id) {
        $.ajax({
            url: '/Test/deleteEmployee',
            type: 'POST',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (response) {
                if (response.status) {
                    alert('delete success');
                    testController.loadData(true);
                }
            },
            error: function (response) {
                alert('deleteEmployee has an error');
            }
        });
    },
    getDetailEmployee: function (id) {
        $.ajax({
            url: '/Test/getDetail',
            type: 'GET',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (response) {
                var data = response.data;
                $('.modal-title').html('Edit Employee');
                $('#txtName').val(data.Name);
                $('#txtSalary').val(data.Salary);
                $('#ckbStatus').prop('checked', data.Status);
                $('#modalAddUpdate').modal('show');
            },
            error: function (response) {
                alert('getDetailEmployee has an error');
            }
        });
    },
    addUpdateEmployee: function () {
        var name = $('#txtName').val();
        var salary = parseFloat($('#txtSalary').val());
        var status = $('#ckbStatus').prop('checked');
        var id = 1;
        var EmployeeID = parseInt($('#txtID').val());
        if (EmployeeID > 0) {
            var dataAdd = {
                ID: EmployeeID,
                Name: name,
                Salary: salary,
                Status: status
            }
            id = 0;
        }
        else {
            var dataAdd = {
                Name: name,
                Salary: salary,
                Status: status
            }
        }

        $.ajax({
            url: '/Test/addUpdateEmployee',
            type: 'POST',
            dataType: 'json',
            data: {
                strData: JSON.stringify(dataAdd),
                id: id
            },
            success: function (response) {
                if (response.status) {
                    alert('save success');
                    testController.loadData(true);
                }
            },
            error: function (response) {
                alert('addUpdateEmployee has an error');
            }
        });
    },
    updateSalary: function (id, value) {
        var dataUpdate = {
            ID: id,
            Salary: value
        };

        $.ajax({
            url: '/Test/updateSalary',
            type: 'POST',
            dataType: 'json',
            data: { model: JSON.stringify(dataUpdate) },
            success: function (response) {
                if (response.status) {
                    alert('success');
                }
            },
            error: function (response) {
                alert('updateSalary has an error');
            }
        });
    },
    loadDataToDT: function () {
        $('#example').DataTable({
            ajax: '/Test/loadDataToDT',
            columns: [
                {
                    data: 'ID'
                },
                {
                    data: 'Name'
                },
                {
                    data: 'Salary'
                },
                {
                    data: 'Status'
                },
                {
                    /*'<button class= "btn btn-primary btnEditEmployee" data-id='ID'> Edit</button>'
                    '<button class="btn btn-danger btnDeleteEmployee" data-id='ID'>Delete</button>'*/
                }
            ]
        });
    },
    loadData: function (changeTotal) {
        $.ajax({
            url: "/Test/loadData",
            type: "GET",
            data: {
                page: testConfig.pageIndex,
                pageSize: testConfig.pageSize
            },
            dataType: "json",
            success: function (response) {
                //alert(response.status);
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var template = $('#data-template').html();
                    //alert(1);
                    $.each(data, function (i, item) {
                        //console.log(item);
                        //alert(1);
                        html += Mustache.render(template, {
                            ID: item.ID,
                            Name: item.Name,
                            Salary: item.Salary,
                            Status: item.Status == true ? '<span class=\"label label-success\">Actived</span>' : '<span class=\"label label-danger\">Blocked</span>'
                        });
                    });
                    $('#tblData').html(html);
                    testController.paging(response.total, changeTotal);
                    testController.registerEvent();
                }

            },
            error: function (response) {
                alert('loadData has an error');
            }
        })
    },
    paging: function (totalRow, changeTotalPage) {

        if (changeTotalPage === true || $('#pagination a').length === 0) {
            $('#pagination').empty();
            $('#pagination').removeData("twbs-pagination");
            $('#pagination').unbind("page");
            if ($('#tblData tr').length === 0) {
                testConfig.pageIndex -= 1;
            }
        }

        $('#pagination').twbsPagination({
                totalPages: Math.ceil(totalRow / testConfig.pageSize),
                visiblePages: 4,
                startPage: testConfig.pageIndex,
                first: "Đầu",
                next: "Kế",
                prev: "Trước",
                last: "Cuối",
                onPageClick: function (event, page) {
                    testConfig.pageIndex = page;
                    setTimeout(testController.loadData(), 200);
                }
        });
    }
}
testController.init();