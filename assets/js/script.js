const API_KEY = "ZEmEeZVJif2i5X6VnxKM-lVqBWo";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// Adding an event listener to the status element. 
// Good practice to send 'e' (the event) to the function even if it's not used.
document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

// use async
async function getStatus(e){

    //needs to use the API_KEY in a GET API request to API_URL
    //needs pass results to a function to display the results

    const queryString = `${API_URL}?api_key=${API_KEY}`;
    
    // use await (can only use this keyword in an async function)
    //await the queryString promise:
    const response = await fetch(queryString);

    //await the json response promise:
    const data = await response.json();

    if (response.ok){
        console.log(data.expiry);
        displayStatus(data);
    } else {
        //data.error is the descriptive error being returned from the json data
        //'throw' is built-in javascript statement allowing the creation of a custom error
        throw new Error(data.error);
    }        
}

function displayStatus(data){

    document.getElementById("resultsModalTitle").innerText = "API Key Status";
    document.getElementById("results-content").innerHTML = `Your key is valid until <br> ${data.expiry}`
    resultsModal.show();

}
function processOptions(form){

    let optionList = [];

    for(let entry of form.entries()){
        if (entry[0] === "options"){
            optionList.push(entry[1])
        }
    }
    //delete existing 'options' because there should only be one
    //options line in the object
    form.delete("options");

    //append a new 'options' and give it a string made up of all
    //entries in the optionList array separated by a comma
    //(not specifiying any delimiter on the join method will default to commas)
    form.append("options", optionList.join());
    for(let entry of form.entries()){
        console.log(entry);
    };
    return form;
}

async function postForm(e){

    //method to create an object from the form data/fields
    //this object is used in the 'body' parameter of the fetch
    //const form = new FormData(document.getElementById("checksform"));

    //needs to have additional processing to format options into comma separated list
    //so will create and use a function do to this:
    const form = processOptions(new FormData(document.getElementById("checksform")));

    //this is will make a POST request to the API, with authorisation, attaching the form object:
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
                    "Authorization": API_KEY,
                 },
        body: form,
    });

    const data = await response.json();
    
    if(response.ok){
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }
      
}

function displayErrors(data){
    
    let results = "";
    let heading = `JSHint Results for ${data.file}`;
    
    if(data.total_errors === 0 ){
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list){
            results += `<div>At line <span class="line">${error.line}</span>,`;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error"> ${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();

}