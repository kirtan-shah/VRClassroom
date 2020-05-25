window.$ = window.jQuery = require('jquery')
require('/lib/velocity.min.js')

import landing from '/pages/landing.html'
import dashboard from '/pages/dashboard.html'
import liveQuiz from '/pages/live-quiz.html'
import smartFeedback from '/pages/smart-feedback.html'
import feedbackAnalysis from '/pages/feedback-analysis.html'
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
                console.log("clicked")
                let q = $('#feedback-question-input').val()
                window.globalSocket.emit('smartFeedback', q, new Date())
            })
        })
        $('#feedback-info').click(function() {
            switchTo(feedbackAnalysis, false)
            socket.emit('requestFeedbacks')
            socket.once('feedbacks', feedbacks => {
                let c = '<div id="constructive">Constructive</div>'
                let d = '<div id="destructive">Destructive</div>'
                for(let fs of Object.values(feedbacks)) {
                    for(let f of fs) {
                        if(f.analysis.constructive) 
                            c += f.text
                        else
                            d += f.text
                    }
                }
                $('#smart-info').html(c + d)
            })
        })
    })
})
