window.$ = window.jQuery = require('jquery')
require('/lib/velocity.min.js')

import landing from '/pages/landing.html'
import dashboard from '/pages/dashboard.html'
import liveQuiz from '/pages/live-quiz.html'
import smartFeedback from '/pages/smart-feedback.html'
import Quiz from './Quiz'
import { switchTo } from './switch.js'

$(document).ready(function() {
    switchTo(landing, false)
    $('#dash-button').show()
    $('#room-id').show()

    $('#dash-button').click(() => {
        switchTo(dashboard, 'down')

        $('#new-live-quiz').click(function() {
            switchTo(liveQuiz, false)
            let quiz = new Quiz(window.globalSocket)
            quiz.initEvents()
        })
        $('#new-smart-feedback').click(function() {
            switchTo(smartFeedback, false)
            $('#send-feedback-form').click(function() {
                let q = $('#feedback-question-input').val()
                window.globalSocket.emit('smartFeedback', q, new Date())
            })
        })
    })
})
