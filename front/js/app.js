window.$ = window.jQuery = require('jquery')
require('/lib/velocity.min.js')

import landing from '/pages/landing.html'
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
    switchTo(landing)

    $('#dash-button').click(() => switchTo(dashboard))

    $('#createRoomBtn').click(function() {
      $('#app').hide()
    })

    $('#joinRoomForm').on('submit', function(e) {
        e.preventDefault()
        let input = $('#joinRoomInput').val().trim()
        if(input.length == 0) {
          alert('you cannot leave this field empty')
        }
        else {
          alert('TODO: set '+input+' as Student class\'s socketRoom variable')
          $('#app').hide()
        }
    })
})
