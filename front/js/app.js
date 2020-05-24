window.$ = window.jQuery = require('jquery')
require('/lib/velocity.min.js')

import landing from '/pages/landing.html'
import dashboard from '/pages/dashboard.html'
import liveQuiz from '/pages/live-quiz.html'
import Quiz from './Quiz'

let currentApp = '#app'
let otherApp = a => a == '#app' ? '#app-tmp' : '#app'

function switchTo(name, direction='left') {
    $(currentApp).show()
    $(otherApp(currentApp)).hide()
    if(direction) {
        slide($(currentApp), direction)
        $(currentApp).html(name)
    }
    else {
        $(currentApp).html(name)
    }
    currentApp = otherApp(currentApp)
}
// function fadeTo(name) {
//     $(currentApp).html(name).ready(() => {
//         $(currentApp).fadeIn(400)
//         $(otherApp(currentApp)).fadeOut(400)
//     })
//     currentApp = otherApp(currentApp)
// }

function slide(el, from) {
    const classes = 'animated fadeIn' + from.charAt(0).toUpperCase() + from.slice(1)
    el.addClass(classes)
        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        () => el.removeClass(classes))
}

$(document).ready(function() {
    switchTo(landing, false)
    $('#dash-button').click(() => {
        switchTo(dashboard, 'down')

        $('#new-live-quiz').click(function() {
            switchTo(liveQuiz, false)
            let quiz = new Quiz(window.globalSocket)
            quiz.initEvents()
        })
    })
})
