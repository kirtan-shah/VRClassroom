
export default class Quiz {

    constructor() {
        this.questions = []
        this.editing = -1
    }

    initEvents() {
        $('#add-question').click(this.addQuestion.bind(this))
        $('#answer-input').on('keydown', ({ keyCode }) => {
            if(keyCode === 13)
                $('#add-question').click()
        })
    }

    clearForm() {
        $('#question-input').val('')
        $('#answer-input').val('')
        $('#question-input').focus()
    }

    listenPreview() {
        let self = this
        $('.preview-group').click(function() {
            self.editing = parseInt($(this).attr('index'))
            let { question, answer } = self.questions[self.editing]
            $('#question-input').val(question)
            $('#answer-input').val(answer)
            $('#add-question').text('Confirm Edit')
        })
    }

    addQuestion() {
        let question = $('#question-input').val()
        let answer = $('#answer-input').val()
        if(this.editing != -1) {
            this.questions[this.editing] = { question, answer }
            this.editing = -1
            $('#add-question').text('Add Question')
        }
        else 
            this.questions.push({ question, answer })
        $('#display-questions').html(this.renderHTML())
        this.listenPreview()
        this.clearForm()
    }

    renderHTML() {
        let str = '<h1>Preview</h1><br>'
        str += '<div id="preview-container">'
        this.questions.forEach(({ question, answer }, i) => {
            str += `
                <div class="preview-group" index=${i}>
                    <div class="edit-icon"></div>
                    <div class="preview-question"><b>Question: </b>${question}</div>
                    <div class="preview-answer"><b>Answer: </b>${answer}</div>
                </div>
            `
        })
        str += '</div>'
        return str
    }
}