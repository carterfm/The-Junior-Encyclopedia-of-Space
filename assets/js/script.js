const REQUESTAPODURL = 'https://api.nasa.gov/planetary/apod/?api_key=mzTxnxnGx9DLnVoAugcd52XptUxh4FL1XpzOSmyw';
//Message to be displayed when our dataset lacks information, which, unfortunately, is
//a fairly frequent occurance even for some of the solar system's less obscure bodies
const INFONOTFOUND = "No information was found in our database. Sorry!";
//By default, the surface gravity values returned by the solar system API we're using are 
//measured in meters per second squared; this constant will be used to convert them to Gs.
const ONEG = 9.8;

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
        var solarBody = $('#planet-input').val();
        $('#planet-input').val('');
        solarBodySearch(solarBody);
    })

    //This function handles searchin our api for 
    function solarBodySearch(solarBody) {
        console.log("Called solarBodySearch with " + solarBody);
        //variable to track whether the search term exists in our database or not; will be set to true if
        //the response upon calling the API is ok. Used to decide whether to display error message or
        //generate text of accordion segment
        var bodyExists = false;
        //variable to track what body this body orbits directly around
        var orbitsAround = '';

        fetch('https://api.le-systeme-solaire.net/rest/bodies/' + solarBody)
            .then(function (response) {
                if (response.ok) {
                    bodyExists = true;
                    return response.json();
                }
            })
            .then(function (data) {
                console.log(data);
                if (bodyExists) {
                    //setting text of title field
                    $('#body-name').text(data.englishName);

                    //Classification and discovery section
                    $('#body-type-text').text('Classification: ' + data.bodyType);
                    if (data.discoveredBy !== '') {
                        $('#discoverer-text').text('Discovered by: ' + data.discoveredBy);
                        $('#discovery-date-text').text('Discovered on: ' + data.discoveryDate);
                    } else {
                        $('#discoverer-text').text('Knowledge of this body has existed since the beginning of recorded history.');
                        $('#discovery-date-text').text('');
                    }

                    //Orbit and rotation section
                    if (data.bodyType === 'Moon'){
                        //Perform a fetch request to get the planet this body orbits around 
                        orbitsAround = 'somePlanet'
                        $('#orbits-around-text').text('Orbits around: ' + orbitsAround);
                    } else {
                        orbitsAround = 'the sun'
                        $('#orbits-around-text').text('Orbits around: ' + orbitsAround);
                    }

                    if (data.aphelion > 0) {
                        $('#apoapsis-text').text('Distance from ' + orbitsAround + ' at farthest point of orbit: ' + data.aphelion + " kilometers");
                    } else {
                        $('#apoapsis-text').text('Distance from ' + orbitsAround + ' at farthest point of orbit: ' + INFONOTFOUND);
                    }

                    if (data.perihelion > 0) {
                        $('#periapsis-text').text('Distance from ' + orbitsAround + ' at closest point of orbit: ' + data.perihelion + " kilometers");
                    } else {
                        $('#periapsis-text').text('Distance from ' + orbitsAround + ' at closest point of orbit: ' + INFONOTFOUND);
                    }

                    if (data.sideralOrbit > 0) {
                        $('#orbital-period-text').text('Length of one full orbit around ' + orbitsAround + ': ' + data.sideralOrbit + ' days');
                    } else {
                        $('#orbital-period-text').text('Length of one full orbit around ' + orbitsAround + ': ' + INFONOTFOUND);
                    }

                    $('#rotational-period-text').text('Length of day (i.e., time for one full rotation): ' + data.sideralRotation + ' hours');

                    //Size, mass, density, and gravity section

                } else {
                    //displaying error message in title field
                    $('#body-name').text(INFONOTFOUND);
                }
            })
    }
})

getApod();

// CARTER: needs accordian function



