const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

const apiKey = 'bc017c08cb595adcc7d279cda48e4469';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {

    res.render('index', {weather: null, error: null});
});

app.post('/', (req, res) => {
    const city = req.body.city;
    const url  = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
    request(url, (err, response, body) => {
        if(err)
            res.render('index', {weather: null, error: 'Please, try again ...'});
        else{
            let weather = JSON.parse(body);
            if(weather.cod === "404"){
                res.render('index', {weather: null, error: weather.message});
            }
            else{
                let weatherText = {
                    weatherClass:  weather.weather[0].main.toLowerCase(),
                    name: weather.name,
                    temp: weather.main.temp,
                    main: weather.weather[0].main,
                    description: weather.weather[0].description
                };
                
                res.render('index', {weather: weatherText, error: null});
            }
        }
    });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});