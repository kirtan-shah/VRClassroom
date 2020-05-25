window.$ = window.jQuery = require('jquery')
require('/lib/velocity.min.js')

import landing from '/pages/landing.html'
import dashboard from '/pages/dashboard.html'
import whiteboard from '/pages/whiteboard.html'
import liveQuiz from '/pages/live-quiz.html'
import smartFeedback from '/pages/smart-feedback.html'
import feedbackAnalysis from '/pages/feedback-analysis.html'
import quizAnalysis from '/pages/quiz-analysis.html'
import Quiz from './Quiz'
import { switchTo, setOnMenuLoad } from './switch.js'

$(document).ready(function() {
    switchTo(landing, false)

    $('#dash-button').show()
    $('#room-id').show()

    $('#dash-button').click(() => {
        setOnMenuLoad(function() {
            $('.title').click(() => openDash(false))
            $('.menu-dash').click(() => openDash(false))
            $('.menu-whiteboard').click(newWhiteboard)
            $('.menu-quiz').click(newLiveQuiz)
            $('.menu-feedback').click(newSmartFeedback)
            $('.menu-feedback-analysis').click(onFeedbackInfo)
            $('.menu-scores').click(onQuizAnalysis)
        })
        openDash()
        
        $('#new-whiteboard').click(newWhiteboard)
        $('#new-live-quiz').click(newLiveQuiz)
        $('#new-smart-feedback').click(newSmartFeedback)
        $('#feedback-info').click(onFeedbackInfo)
        $('#quizzes-info').click(onQuizAnalysis)
    })
})

function openDash(direction='down') {
    switchTo(dashboard, direction)
}
function newWhiteboard() {
    switchTo(whiteboard, false)
    window.globalSocket.emit('openWhiteboard')
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
function onQuizAnalysis() {
    switchTo(quizAnalysis, false)
    window.globalSocket.emit('requestQuizzes')
    window.globalSocket.once('quizzes', quizzes => {
        let str = ''
        for(let date of Object.keys(quizzes)) {
            str += `<div class="quiz-date">${date}</div>`
            for(let { score, name } of quizzes[date]) {
                str += `<div class="quiz-score">
                        <span class="name"><b>${name}</b></span>
                        <span class="score">${Math.round(score*10000) / 100}%</span>
                    </div>`
            }
        }
        $('#scores-info').html(str)
    })
}