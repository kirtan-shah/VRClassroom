window.$ = window.jQuery = require('jquery')
require('/lib/velocity.min.js')

import landing from '/pages/landing.html'
import dashboard from '/pages/dashboard.html'
import liveQuiz from '/pages/live-quiz.html'
import Quiz from './Quiz'
import { switchTo } from './switch.js'

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
