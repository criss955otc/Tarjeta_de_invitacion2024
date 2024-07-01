simplyCountdown('#cuenta', {
    year: 2024, // required
    month: 7, // required
    day: 20, // required
    hours: 0, // Default is 0 [0-23] integer
    minutes: 0, // Default is 0 [0-59] integer
    seconds: 0, // Default is 0 [0-59] integer
    words: { //words displayed into the countdown
        days: { singular: 'day', plural: 'days' },
        hours: { singular: 'hour', plural: 'hours' },
        minutes: { singular: 'minute', plural: 'minutes' },
        seconds: { singular: 'second', plural: 'seconds' }
    },
    plural: true, //use plurals
    inline: false, //set to true to get an inline basic countdown like : 24 days, 4 hours, 2 minutes, 5 seconds
    inlineClass: 'simply-countdown-inline', //inline css span class in case of inline = true
    // in case of inline set to false
    enableUtc: false, //Use UTC or not - default : false
    onEnd: function() {
        alert ('Finalizo') 
        return; }, //Callback on countdown end, put your own function here
    refresh: 1000, // default refresh every 1s
    sectionClass: 'simply-section', //section css class
    amountClass: 'simply-amount', // amount css class
    wordClass: 'simply-word', // word css class
    zeroPad: false,
    countUp: false
});

let currentIndex = 0;

function moveSlide(direction) {
    const items = document.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    const itemsPerView = 5;

    currentIndex = (currentIndex + direction + totalItems) % totalItems;

    // Asegurar que el índice no mueva menos de tres elementos
    if (currentIndex < 0) {
        currentIndex = totalItems - itemsPerView;
    } else if (currentIndex > totalItems - itemsPerView) {
        currentIndex = 0;
    }

    const offset = -currentIndex * (100 / itemsPerView);
    document.querySelector('.carousel').style.transform = `translateX(${offset}%)`;
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.carousel').style.transform = 'translateX(0%)';
});

function createInputs() {
    const select = document.getElementById('inv');
    const inputContainer = document.getElementById('inputContainer');
    const numberOfInputs = parseInt(select.value, 10);

    // Clear the container
    inputContainer.innerHTML = '';

    // Create the inputs
    for (let i = 0; i < numberOfInputs; i++) {
        const input = document.createElement('input');
        const label = document.createElement('label');
        label.type = 'text';
        label.innerText = `Nombres y apellidos`;
        input.type = 'text';
        input.placeholder = `Invitado ${i + 1}`;
        inputContainer.appendChild(label);
        inputContainer.appendChild(input);        
    }
}