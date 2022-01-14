const REQUESTAPODURL = 'https://api.nasa.gov/planetary/apod/?api_key=mzTxnxnGx9DLnVoAugcd52XptUxh4FL1XpzOSmyw';
const ONECALLSOLARSYSTEM = 'https://api.le-systeme-solaire.net/rest/bodies/';
//Message to be displayed when our dataset lacks information, which, unfortunately, is
//a fairly frequent occurance even for some of the solar system's less obscure bodies
const INFONOTFOUND = "No information was found in our database. Sorry!";
//By default, the surface gravity values returned by the solar system API we're using are 
//measured in meters per second squared; this constant will be used to convert them to Gs.
const ONEG = 9.8;

//Some information about our stellar bodies is associated with their ids (which are essentially just
//their French names written in all lowercase), so we need an object that associates these ids with the bodies'
//English names
var idToEngName = {}

function getIdToEngName () {
    fetch(ONECALLSOLARSYSTEM)
        .then(function (response){
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            for (var i = 0; i < data.bodies.length; i++) {
                //For a few obscure bodies, englishName is missing from the api's data
                //For these, we'll just use their ID
                if (data.bodies[i].englishName !== '') {
                    idToEngName[data.bodies[i].id] = data.bodies[i].englishName;
                } else {
                    idToEngName[data.bodies[i].id] = data.bodies[i].id;
                }
            }
            console.log(idToEngName);
        })
}

function getApod () {
    fetch(REQUESTAPODURL)
        .then(function (response){
            return response.json();
        })
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
            $('#apod-copyright').text("© " + apodCopyRight);
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

        fetch(ONECALLSOLARSYSTEM + solarBody)
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
                        orbitsAround = idToEngName[data.aroundPlanet.planet];
                        $('#orbits-around-text').text('Orbits around: ' + orbitsAround);
                    } else {
                        orbitsAround = 'the sun'
                        $('#orbits-around-text').text('Orbits around: ' + orbitsAround);
                    }

                    if (data.aphelion > 0) {
                        $('#apoapsis-text').text('Distance from ' + orbitsAround + ' at farthest point of orbit: ' + data.aphelion + ' kilometers');
                    } else {
                        $('#apoapsis-text').text('Distance from ' + orbitsAround + ' at farthest point of orbit: ' + INFONOTFOUND);
                    }

                    if (data.perihelion > 0) {
                        $('#periapsis-text').text('Distance from ' + orbitsAround + ' at closest point of orbit: ' + data.perihelion + ' kilometers');
                    } else {
                        $('#periapsis-text').text('Distance from ' + orbitsAround + ' at closest point of orbit: ' + INFONOTFOUND);
                    }

                    if (data.sideralOrbit > 0) {
                        $('#orbital-period-text').text('Length of one full orbit around ' + orbitsAround + ': ' + data.sideralOrbit + ' days');
                    } else {
                        $('#orbital-period-text').text('Length of one full orbit around ' + orbitsAround + ': ' + INFONOTFOUND);
                    }

                    if (data.sideralRotation > 0){
                        $('#rotational-period-text').text('Time for one full rotation relative to the stars: ' + data.sideralRotation + ' hours');
                    } else {
                        $('#rotational-period-text').text('Time for one full rotation relative to the stars: ' + INFONOTFOUND)
                    }
                    

                    //Size, mass, density, and gravity section
                    if (data.equaRadius > 0) {
                        $('#equa-radius-text').text('Radius at equator: ' + data.equaRadius + ' kilometers');
                    } else {
                        $('#equa-radius-text').text('Radius at equator: ' + INFONOTFOUND);
                    }

                    if (data.polarRadius > 0) {
                        $('#polar-radius-text').text('Radius at poles: ' + data.polarRadius + ' kilometers');
                    } else {
                        $('#polar-radius-text').text('Radius at poles: ' + INFONOTFOUND);
                    }

                    if (data.meanRadius > 0) {
                        $('#mean-radius-text').text('Average radius: ' + data.meanRadius + " kilometers");
                    } else {
                        $('#mean-radius-text').text('Average radius: ' + INFONOTFOUND);
                    }

                    //The mass measurements this api provides are measured in kilograms rather than in metric tons,
                    //and we want to display them in metric tons. Thus, we're subtracting 3 from the mass exponent
                    //--since x * 10^(y) kg is equal to x * 10^(y - 3) tons
                    if (data.mass !== null) {
                        var newExponent = data.mass.massExponent - 3;
                        $('#mass-text').text('Mass: ' + data.mass.massValue + ' * 10^(' + newExponent + ') metric tons' );
                    } else {
                        $('#mass-text').text('Mass: ' + INFONOTFOUND);
                    }

                    //Similarly, the data on density this api provides are measured in grams per cubic centimeter,
                    //and we want to display them in kilograms per cubic meter, so we'll multiply the density
                    //figures the api gives us by 1000
                    if (data.density > 0) {
                        var convertedDensity = data.density * 1000;
                        $('#density-text').text('Density: ' + convertedDensity + ' kilograms per cubic meter')
                    } else {
                        $('#density-text').text('Density: ' + INFONOTFOUND);
                    }

                    //Finally, gravity is given in meters per second squared, so to convert it to Gs, we just
                    //have to divide by 9.8
                    if (data.gravity > 0) {
                        var gravityGs = data.gravity/ONEG;
                        $('#gravity-text').text('Surface gravity: ' + gravityGs + 'Gs');
                    } else {
                        $('#gravity-text').text('Surface gravity: ' + INFONOTFOUND);
                    }

                    //Moons section: to do later

                } else {
                    //displaying error message in title field
                    $('#body-name').text(INFONOTFOUND);
                }
            })
    }
})

getIdToEngName();
getApod();

// CARTER: needs accordian function



