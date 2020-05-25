window.$ = window.jQuery = require('jquery')
require('/lib/velocity.min.js')

import landing from '/pages/landing.html'
import dashboard from '/pages/dashboard.html'
import whiteboard from '/pages/whiteboard.html'
import liveQuiz from '/pages/live-quiz.html'
import smartFeedback from '/pages/smart-feedback.html'
import feedbackAnalysis from '/pages/feedback-analysis.html'
import Quiz from './Quiz'
import { switchTo, setOnMenuLoad } from './switch.js'
import * as firebase from 'firebase'
import 'firebase/storage'

let firebaseConfig = {
  apiKey: "AIzaSyByvmyJHzHc472pLWyKhsu1JCaBm2MLf9Y",
  authDomain: "vr-classroom-214b2.firebaseapp.com",
  databaseURL: "https://vr-classroom-214b2.firebaseio.com",
  projectId: "vr-classroom-214b2",
  storageBucket: "vr-classroom-214b2.appspot.com",
  messagingSenderId: "659971797979",
  appId: "1:659971797979:web:76157965ae2a6f224d6dfe",
  measurementId: "G-E5VEJG1ZHL"
}

firebase.initializeApp(firebaseConfig)
firebase.analytics()

$(document).ready(function() {
    switchTo(landing, false)

    $('#dash-button').show()
    $('#room-id').show()

    $('#profileImage').on('change', function(){
      alert('handle image upload code to be written')

      let data = {}
      let file = $('#profileImage')[0].files[0]
      let reader  = new FileReader()

      reader.onloadend = function() {
        data.imageDataIn = reader.result

      }

      reader.readAsDataURL(file)
    })


    $('#dash-button').click(() => {
        openDash()

        setOnMenuLoad(function() {
            $('.title').click(() => openDash(false))
            $('.menu-dash').click(() => openDash(false))
            $('.menu-whiteboard').click(newWhiteboard)
            $('.menu-quiz').click(newLiveQuiz)
            $('.menu-feedback').click(newSmartFeedback)
            $('.menu-feedback-analysis').click(onFeedbackInfo)
        })
        $('#new-whiteboard').click(newWhiteboard)
        $('#new-live-quiz').click(newLiveQuiz)
        $('#new-smart-feedback').click(newSmartFeedback)
        $('#feedback-info').click(onFeedbackInfo)
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
