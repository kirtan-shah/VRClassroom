import { switchTo, closeApp } from './switch.js'

import liveQuizClient from '/pages/live-quiz-client.html'

export default class StudentUI {

    constructor(socket) {
        this.socket = socket
        this.questionIndex = 0
        this.numCorrect = 0

        let self = this
        socket.on('quiz', questions => { 
            switchTo('<div id="quiz-client" class="dashboard">' + liveQuizClient + '</div>', 'up')
            self.questionIndex = 0
            self.numCorrect = 0
            self.questions = questions
            self.nextQuestion()
        })
    }

    compare(a, b) {
        return a.toLowerCase().trim().replace(/ /g,'') == b.toLowerCase().trim().replace(/ /g,'')
    }

    nextQuestion() {
        if(this.questionIndex >= this.questions.length) {
            this.finishQuiz()
            return
        }
        let q = this.questions[this.questionIndex]
        if(this.questionIndex > 0) {
            if(q.type == 'mc' && this.compare($('input[name="quiz-mc-radios"]:checked').val(), q.answer))
                this.numCorrect++
            if(q.type == 'frq' && this.compare($('#quiz-answer-input').val(), q.answer))
                this.numCorrect++
        }
        this.renderQuiz(q, this.questionIndex == this.questions.length - 1)
        this.questionIndex++
    }

    finishQuiz() {
        $('#quiz-mc').hide()
        $('#quiz-frq').hide()
        setTimeout(() => {
            
        })
    }

    renderQuiz(question, last) {
        let self = this
        let str = liveQuizClient.replace('\${question}', question.question)
        console.log(str)
        if(question.type == 'mc') {
            let correctIndex = Math.floor(Math.random() * 3) + 1
            let wrongIndex0 = correctIndex % 3 + 1
            let wrongIndex1 = (correctIndex + 1) % 3 + 1
            if(Math.random() < .5) {
                let tmp = wrongIndex0
                wrongIndex0 = wrongIndex1
                wrongIndex1 = tmp
            }
            str = str
                .replace('\${isCorrect' + correctIndex + '}', 'correct')
                .replace('\${isCorrect' + wrongIndex0 + '}', 'wrong')
                .replace('\${isCorrect' + wrongIndex1 + '}', 'wrong')
                .replace('\${answer' + correctIndex + '}', question.answer)
                .replace('\${answer' + wrongIndex0 + '}', question.wrong[0])
                .replace('\${answer' + wrongIndex1 + '}', question.wrong[1])
        }
        $('#quiz-client').html(str).ready(function() {
            $('#quiz-' + question.type).show()
            $('#quiz-' + ((question.type == 'frq') ? 'mc' : 'frq')).hide()
            $('#next-question-button').html(last ? 'Finish' : 'Next').click(() => self.nextQuestion())
        })
    }
}