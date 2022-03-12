$('#sidebarToggleTop').off('click').on('click', function () {
    $('#accordionSidebar').css('transform', 'translate(0%,0%)');
    $('#backdrop').css('display', 'block');
});

$('#backdrop').off('click').on('click', function () {
    $('#accordionSidebar').css('transform', 'translate(-100%,0%)');
    $('#backdrop').css('display', 'none').fadeOut();
});