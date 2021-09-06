const API_KEY = "1KKBcDY9XFthklkrhi9VSTFuJx4";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// Adding an event listener to the status element. 
// Good practice to send 'e' (the event) to the function even if it's not used.
document.getElementById("status").addEventListener("click", e => getStatus(e));

// use async
async function getStatus(e){

    //needs to use the API_KEY in a GET API request to API_URL
    //needs pass results to a function to display the results

    const queryString = `${API_URL}?api_key=${API_KEY})`;
    
    // use await (can only use this keyword in an async function)
    //await the queryString promise:
    const response = await fetch(queryString);

    //await the json response promise:
    const data = await response.json();

    if (response.ok){
        console.log(data.expiry);
    }
        

}
