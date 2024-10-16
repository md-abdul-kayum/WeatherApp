document.getElementById('weatherForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const city = document.getElementById('cityInput').value;
    fetchWeather(city);
});

document.getElementById('clearData').addEventListener('click', clearData);

document.getElementById('sortByTemp').addEventListener('click', () => sortTable('temp'));
document.getElementById('sortByHumidity').addEventListener('click', () => sortTable('humidity'));

async function fetchWeather(city) {
    const apiKey = '63165e282fe747c9abb175555241510'; 
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        displayError(error);
    }
}

function displayWeather(data) {
    const weatherTable = document.getElementById('weatherTable').getElementsByTagName('tbody')[0];
    weatherTable.innerHTML = '';
    const { forecast } = data;
    forecast.forecastday.forEach(day => {
        const dateObj = new Date(day.date);
        const formattedDate = formatDate(dateObj);
        const dayName = dateObj.toLocaleString('en-US', { weekday: 'long' }); // Get the day name
        
        const row = weatherTable.insertRow();
        row.insertCell(0).textContent = `${dayName}, (${formattedDate})`; // Show day name and formatted date
        row.insertCell(1).innerHTML = `<img src="${day.day.condition.icon}" alt="${day.day.condition.text}"> ${day.day.condition.text}`;
        row.insertCell(2).textContent = day.day.avgtemp_c;
        row.insertCell(3).textContent = day.day.avghumidity;
        row.insertCell(4).textContent = day.day.maxwind_kph;
    });
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; 
}

function displayError(error) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = `Error: ${error.message}`;
}

function clearData() {
    const weatherTable = document.getElementById('weatherTable').getElementsByTagName('tbody')[0];
    weatherTable.innerHTML = '';
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = ''; 
}

function sortTable(type) {
    const table = document.getElementById('weatherTable').getElementsByTagName('tbody')[0];
    const rows = Array.from(table.rows);
    let compareFunction;

    if (type === 'temp') {
        compareFunction = (a, b) => parseFloat(a.cells[2].textContent) - parseFloat(b.cells[2].textContent);
    } else if (type === 'humidity') {
        compareFunction = (a, b) => parseFloat(a.cells[3].textContent) - parseFloat(b.cells[3].textContent);
    }

    rows.sort(compareFunction);

    table.innerHTML = '';
    rows.forEach(row => table.appendChild(row));
}
