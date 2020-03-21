/**
 * Created by rschoppa on 2/27/18.
 */
try {
    screen.orientation.lock('landscape');
}
catch (e) {
    console.log('Force landscape failed')
}

$('#pause').on('click', function () {
    $('#menu-main').css('display','block');

});

$('#menu-close').on('click', function () {
    $('#menu-main').css('display','none');

});

$('.menu-item').on('click', function () {
    switch ($(this).attr('action')) {
        case 'continue':
            $('#menu-main').css('display','none');
            break;
        case 'restart':
            window.location.reload()
            break;
        case 'leave':
            window.location = '/'
            break;

    }

});

