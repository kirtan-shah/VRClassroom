window.$ = window.jQuery = require('jquery')
require('/lib/velocity.min.js')

import landing from '/pages/landing.html'
import dashboard from '/pages/dashboard.html'

function switchTo(name, direction='left') {
    $('#app').show()
    if(direction) slide($('#app'), direction)
    $('#app').html(name)
}

function slide(el, from) {
    const classes = 'animated fadeIn' + from.charAt(0).toUpperCase() + from.slice(1)
    el.addClass(classes)
        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        () => el.removeClass(classes))
     /*
    switch(from) {
        case 'top':
            el.css({ top: '-100%' }).hide().fadeIn(duration).velocity({ top: 0 }, easing, { duration })
            break
        case 'bottom':
            el.css({ top: '100%' }).hide().fadeIn(duration).velocity({ top: 0 }, easing, { duration })
            break
        case 'left':
            el.css({ left: '-100%' }).hide().fadeIn(duration).velocity({ left: 0 }, easing, { duration })
            break
        case 'right':
            el.css({ left: '100%' }).hide().fadeIn(duration).velocity({ left: 0 }, easing, { duration })
            break
    }*/
}

$(document).ready(function() {
    switchTo(landing, false)

    $('#dash-button').click(() => switchTo(dashboard, 'down'))
})
