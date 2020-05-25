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

$(document).ready(function() {
    switchTo(landing, false)

    $('#dash-button').show()
    $('#room-id').show()

    $('#profileImage').on('change', function(){
      alert('handle image upload code to be written')


      let data = {}

      data.imageDataIn = 'hello'

      let xmlhttp = new XMLHttpRequest()
      let theUrl = '/uploadImage'

      xmlhttp.open('Post', theUrl)
      xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      xmlhttp.send(JSON.stringify(data))

      xmlhttp.onload  = function (e) {
        if (xmlhttp.readyState === 4) {
          if (xmlhttp.status === 200) {
            let obj = JSON.parse(xmlhttp.responseText)
            let result = obj.success
            console.log(result)
          }
          else {
            console.error(xmlhttp.statusText)
            console.log(2)
            alert("Error contacting server.")
          }
        }
      }


    })


    $('#dash-button').click(() => {
        openDash()

        setOnMenuLoad(function() {
            $('#menu-dash').click(openDash)
            $('#menu-whiteboard').click(newWhiteboard)
            $('#menu-quiz').click(newLiveQuiz)
            $('#menu-feedback').click(newSmartFeedback)
            $('#menu-feedback-analysis').click(onFeedbackInfo)
        })
        $('#new-whiteboard').click(newWhiteboard)
        $('#new-live-quiz').click(newLiveQuiz)
        $('#new-smart-feedback').click(newSmartFeedback)
        $('#feedback-info').click(onFeedbackInfo)
    })
})

function openDash() {
    switchTo(dashboard, 'down')
}
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
