window.$ = window.jQuery = require('jquery')
require('/lib/velocity.min.js')


import dashboard from '/pages/dashboard.html'

function switchTo(name) {
    if(!$('#app').is(':visible'))
        slide($('#app'), 'left')
    $('#app').html(name)
}

function slide(el, from) {
    const duration = 500
    const easing = 'easeInOutCubic'
    switch(from) {
        case 'top':
            el.css({ top: '-100%' }).fadeIn(duration).velocity({ top: 0 }, easing, { duration })
            break
        case 'bottom':
            el.css({ top: '100%' }).fadeIn(duration).velocity({ top: 0 }, easing, { duration })
            break
        case 'left':
            el.css({ left: '-100%' }).fadeIn(duration).velocity({ left: 0 }, easing, { duration })
            break
        case 'right':
            el.css({ left: '100%' }).show().animate({ left: 0 }, easing, duration)
            break
    }
}

$(document).ready(function() {
    $('#dash-button').click(() => switchTo(dashboard))
})