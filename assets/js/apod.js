const requestUrl = 'https://api.nasa.gov/planetary/apod/?api_key=mzTxnxnGx9DLnVoAugcd52XptUxh4FL1XpzOSmyw'

function getApod(){
    fetch(requestUrl)
      .then(function (response){
          return response.json();
      })
      .then(function (data){
          console.log(data);
      })
}

getApod()