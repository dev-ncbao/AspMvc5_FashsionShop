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

function GetUserPermission() {
    data = $.ajax({
        url: '/quan-ly/trang-chu/GetUserPermission',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            ActiveFeature(response.data);
        }
    });
}

function ActiveFeature(UserPermission) {
    console.log(UserPermission);
    var nav = $('#accordionSidebar li a');
    var homeMenu = $('.home-menu');
    if (UserPermission === 'CV02') {
        $(homeMenu[1]).addClass('disabled');
        //$(nav[1]).addClass('disabled');
        $(nav[2]).addClass('disabled');
        //$(nav[3]).addClass('disabled');
        //$(nav[4]).addClass('disabled');
        //$(nav[5]).addClass('disabled');
        //$(nav[6]).addClass('disabled');
        $(nav[7]).addClass('disabled');
        //$(nav[8]).addClass('disabled');
    }
    
    if (UserPermission === 'CV03') {
        $(homeMenu[1]).addClass('disabled');
        $(homeMenu[3]).addClass('disabled');
        //$(nav[1]).addClass('disabled');
        $(nav[2]).addClass('disabled');
        //$(nav[3]).addClass('disabled');
        //$(nav[4]).addClass('disabled');
        $(nav[5]).addClass('disabled');
        //$(nav[6]).addClass('disabled');
        $(nav[7]).addClass('disabled');
        $(nav[8]).addClass('disabled');
    }

    if (UserPermission === null) {
        location.href = '/quan-ly/dang-xuat/';
    }


}

$(document).ready(function () {
    GetUserPermission();
});