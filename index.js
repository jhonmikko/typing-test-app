// Define the URL for fetching a random quote within specific length constraints
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";

// Reference to the HTML element where the quote will be displayed
const quoteSection = document.getElementById("quote");

// Reference to the user input field
const userInput = document.getElementById("quote-input");

// Initialize variables for quote, time, timer, and mistakes
let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// Function to fetch a new quote from the API and render it
const renderNewQuote = async () => {
    const response = await fetch(quoteApiUrl);
    let data = await response.json();
    quote = data.content;

    // Split the quote into individual characters and wrap each in a span element for styling
    let arr = quote.split("").map((value) => {
        return "<span class='quote-chars'>" + value + "</span>";
    });

    // Display the quote in the quote section
    quoteSection.innerHTML += arr.join("");
};

// Event listener for user input
userInput.addEventListener("input", () => {
    // Select all characters in the quote
    let quoteChars = document.querySelectorAll(".quote-chars");
    quoteChars = Array.from(quoteChars);
    
    // Split user input into individual characters
    let userInputChars = userInput.value.split("");
    
    // Iterate through each character in the quote
    quoteChars.forEach((char, index) => {
        if(char.innerText == userInputChars[index]){
            // If the character matches user input, add success class
            char.classList.add("success");
        }else if(userInputChars[index] == null){
            // If there's no user input, remove classes
            if(char.classList.contains("success")){
                char.classList.remove("success");
            } else {
                char.classList.remove("fail");
            }
        }else{
            // If there's a mistake, add fail class and update mistake count
            if(!char.classList.contains("fail")){
                mistakes++;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }

        // Check if all characters are correctly typed
        let check = quoteChars.every((element) => {
            return element.classList.contains("success");
        });
        
        // If all characters are correctly typed, display the result
        if(check){
            displayResult();
        }

    });
});

// Function to update the timer
function updateTimer(){
    if(time == 0){
        // If time is up, display the result
        displayResult();
    } else{
        // Update the timer display
        document.getElementById("timer").innerText = --time + "s";
    }
}

// Function to start the timer
const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
}

// Function to display the result
const displayResult = () => {
    // Show the result section
    document.querySelector(".result").style.display = "block";
    clearInterval(timer); // Stop the timer
    document.getElementById("stop-test").style.display = "none"; // Hide stop button
    userInput.disabled = true; // Disable user input
    let timeTaken = 1;
    if(time != 0){
        // Calculate time taken if not zero
        timeTaken = (60 - time) / 100;
    }
    // Display WPM and accuracy
    document.getElementById("wpm").innerText = (userInput.value.length).toFixed(2) + "wpm";
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";
};

// Function to start the typing test
const startTest = () => {
    mistakes = 0; // Reset mistakes count
    timer: ""; // Reset timer
    userInput.disabled = false; // Enable user input
    timeReduce(); // Start the timer
    document.getElementById("start-test").style.display = "none"; // Hide start button
    document.getElementById("stop-test").style.display = "block"; // Show stop button
};

// Function to run on window load
window.onload = () => {
    userInput.value = ""; // Clear user input
    document.getElementById("start-test").style.display = "block"; // Show start button
    document.getElementById("stop-test").style.display = "none"; // Hide stop button
    userInput.disabled = true; // Disable user input
    renderNewQuote(); // Fetch and render a new quote
}
