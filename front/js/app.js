window.$ = window.jQuery = require('jquery')
require('/lib/velocity.min.js')

import landing from '/pages/landing.html'
import dashboard from '/pages/dashboard.html'
import whiteboard from '/pages/whiteboard.html'
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

        $('#new-white-board').click(newWhiteboard)
        $('#new-live-quiz').click(newLiveQuiz)
        $('#new-smart-feedback').click(newSmartFeedback)
        $('#feedback-info').click(onFeedbackInfo)
    })
})

function newWhiteboard() {
    switchTo(whiteboard, false)
}
function newLiveQuiz() {
    switchTo(liveQuiz, false)
    let quiz = new Quiz(window.globalSocket)
    quiz.initEvents()
}
function newSmartFeedback() {
    switchTo(smartFeedback, false)
    $('#send-feedback-form').click(function() {
        console.log("clicked")
        let q = $('#feedback-question-input').val()
        window.globalSocket.emit('smartFeedback', q, new Date())
    })
}
function onFeedbackInfo() {
    switchTo(feedbackAnalysis, false)
    window.globalSocket.emit('requestFeedbacks')
    window.globalSocket.once('feedbacks', feedbacks => {
        let c = '<div id="constructive">Constructive</div>'
        let d = '<div id="destructive">Destructive</div>'
        for(let fs of Object.values(feedbacks)) {
            for(let f of fs) {
                if(f.analysis.constructive) 
                    c += `<div>${f.text}</div>`
                else
                    d += `<div>${f.text}</div>`
            }
        }
        $('#smart-info').html(c + d)
    })
}