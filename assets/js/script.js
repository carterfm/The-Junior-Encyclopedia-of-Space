const REQUESTAPODURL = 'https://api.nasa.gov/planetary/apod/?api_key=mzTxnxnGx9DLnVoAugcd52XptUxh4FL1XpzOSmyw'
const ONECALLSOLARSYSTEM = "https://api.le-systeme-solaire.net/rest/bodies/";
const ONEG = 9.8;

//Some of the information we want to generate when searching our database
//is only available in French--specifically, if a body has moons and we want
//to access them or a body orbits around a planet and we want to access that planet,
//that information is in French. So, we'll use this object to build up and store a
//set of French -> English translations for the names of all the bodies covered by
//our solar system API
var frenchToEnglish = {};

function getTranslations () {
    //If this is the first time building our frenchToEnglish object up, we'll use an API
    //call; otherwise, we'll just retrieve it from local storage
    savedFrenchToEnglish = JSON.parse(localStorage.getItem("frenchToEnglish"));

    if (savedFrenchToEnglish !== null) {
        frenchToEnglish = savedFrenchToEnglish;
    } else {
        fetch(ONECALLSOLARSYSTEM)
        .then(response =>
            response.json())
        .then(function (data) {
            for (var i = 0; i < data.bodies.length; i++) {
                frenchToEnglish[data.bodies[i].name] = data.bodies[i].englishName;
            }
            localStorage.setItem("frenchToEnglish", JSON.stringify(frenchToEnglish));
        })
    }

}

function getApod () {
    fetch(REQUESTAPODURL)
        .then(response =>
            response.json())
        .then(function (data) {
            /*console.log("Got Apod:")
            console.log(data);*/
            var apodCopyRight = data.copyright;
            var apodExplanation = data.explanation;
            var apodTitle = data.title;
            //Displaying photo and description of astronomy photo of the day 
            $('#apod-img').attr('src', data.url);
            $('#apod-title').text(apodTitle);
            $('#apod-explanation').text(apodExplanation);
            $('#apod-copyright').text(apodCopyRight);
        })
}

//Holding off and only implementing the interactive elements until the page load is complete
$(document).ready(function() {
    $('form').on('submit', function (event) {
        event.preventDefault()
        //$('.apod-container').addClass('hide');
        //$('.apod-container').css('display', 'none');
        var solarBody = $('.planet-input').val();
        $('.planet-input').val('');
        solarbodysearch(solarBody);
    })

    //This function handles searchin our api for 
    function solarbodysearch(solarBody) {
        //Need a variable to track what kind of stellar body this is

        fetch(`https://api.le-systeme-solaire.net/rest/bodies/${solarBody}`)
            .then(response =>
                response.json())
            .then(function (data) {
                console.log(data);
                //Setting text of info elements in the accordion section
                $('#body-type-text').text(data.bodyType);
                //$("#distance-from-sun-text")
                $('#discoverer-text').text(data.discoveredBy);
                $('#discovery-date-text').text(data.discoveryDate);
                $('#gravity-text').text((data.gravity/ONEG) + ' Gs');
                //What unit is density measured in?
                $('#orbital-period-text').text(data.sideralOrbit + ' days');
                $('#rotational-period-text').text(data.sideralRotation + ' hours');
            })
    }
})

getTranslations();
// CARTER: needs accordian function

