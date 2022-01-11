const requestUrl = 'https://api.nasa.gov/planetary/apod/?api_key=mzTxnxnGx9DLnVoAugcd52XptUxh4FL1XpzOSmyw'

function getApod(){
    fetch(requestUrl)
      .then(function (response){
          return response.json();
      })
      .then(function (data){
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