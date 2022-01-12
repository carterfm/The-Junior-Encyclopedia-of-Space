const requestUrl = 'https://api.nasa.gov/planetary/apod/?api_key=mzTxnxnGx9DLnVoAugcd52XptUxh4FL1XpzOSmyw'

function getApod() {
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var apodCopyRight = data.copyright;
            var apodExplanation = data.explanation;
            var apodTitle = data.title;
            $('#apod-img').attr('src', data.url);
            $('#apod-title').text(apodTitle);
            $('#apod-explanation').text(apodExplanation);
            $('#apod-copyright').text(apodCopyRight);

        })
}

getApod()

$(document).ready(function () {
    $('.submit-btn').on('click', function (event) {
        event.preventDefault()
        $('.apod-container').addClass('hide')
        var solarBody = $('.planet-input').val();
        $('.planet-input').val('');
        solarbodysearch(solarBody);
    })

    function solarbodysearch(solarBody) {
        fetch(`https://api.le-systeme-solaire.net/rest/bodies/${solarBody}`)
            .then(response =>
                response.json())
            .then(data =>
                console.log(data))
    }



})

// CARTER: needs accordian function
