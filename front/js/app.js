window.$ = window.jQuery = require('jquery')
require('/lib/velocity.min.js')

import landing from '/pages/landing.html'
import dashboard from '/pages/dashboard.html'

function switchTo(name) {
    slide($('#app'), 'left')
    $('#app').html(name)
}

function slide(el, from) {
    const duration = 500
    const easing = 'easeInOutCubic'
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
    }
}

$(document).ready(function() {
    switchTo(landing)

    $('#dash-button').click(() => switchTo(dashboard))
})
