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


/*Aqui vamos a crear los imputs*/

function createInputs() {
    const numInvitados = document.getElementById('inv').value;
    const container = document.getElementById('inputContainer');
    container.innerHTML = ''; // Limpiar container antes de agregar nuevos campos

    for (let i = 0; i < numInvitados; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Nombre del acompañante ${i + 1}`;
        input.name = `acompanante_${i + 1}`;
        input.classList.add('form-control');
        container.appendChild(input);
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const numInvitados = document.getElementById('inv').value;
    const acompañantes = [];

    for (let i = 0; i < numInvitados; i++) {
        const acompañante = document.getElementsByName(`acompanante_${i + 1}`)[0].value;
        acompañantes.push(acompañante);
    }

    // Enviar los datos al servidor usando fetch
    try {
        const response = await fetch('/sub', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombres,
                apellidos,
                cantidad_acompanantes: numInvitados,
                acompañantes
            })
        });

        if (!response.ok) {
            throw new Error('Error al enviar los datos al servidor');
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        // Aquí podrías redirigir a otra página o mostrar un mensaje de éxito
    } catch (error) {
        console.error('Error:', error.message);
        // Aquí podrías mostrar un mensaje de error al usuario
    }
}


  