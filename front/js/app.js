import $ from 'jquery'

import dashboard from '/pages/dashboard.html'

function switchTo(name) {
    $('#app').html(name)
}


$(document).ready(function() {
    switchTo(dashboard)
})
