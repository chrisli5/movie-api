require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./MOVIES');

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors());

app.use(function validateToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized access' })
    }
    next();
});

app.get('/', (req, res) => {
    res.status(200).json('Hello Express');
});

app.get('/movie', (req, res) => {
    const { genre, country, avg_vote } = req.query;
    let response = MOVIES;

    if(genre) {
        response = response.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()));
    }

    if(country) {
        response = response.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()));
    }

    if(avg_vote) {
        const vote = Number(avg_vote) || 0;
        response = response.filter(movie => Number(movie.avg_vote) >= vote);
    }

    res.json(response);
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});