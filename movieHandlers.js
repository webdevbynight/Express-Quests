const movies =
[
    {
        id: 1,
        title: "Citizen Kane",
        director: "Orson Wells",
        year: "1941",
        colors: false,
        duration: 120,
    },
    {
        id: 2,
        title: "The Godfather",
        director: "Francis Ford Coppola",
        year: "1972",
        colors: true,
        duration: 180,
    },
    {
        id: 3,
        title: "Pulp Fiction",
        director: "Quentin Tarantino",
        year: "1994",
        color: true,
        duration: 180,
    },
];

const database = require('./database');

const getMovies = (req, res) =>
{
    database
        .query("SELECT * FROM movies")
        .then(([movies]) => res.json(movies))
        .catch(err =>
        {
            console.error(err);
            res.status(500).send('Error retrieving data from database');
        });
};

const getMovieById = (req, res) =>
{
    const id = parseInt(req.params.id);
    database
        .query("SELECT * FROM movies WHERE id = ?", [id])
        .then(([movies]) => movies[0] ? res.json(movies[0]) : res.status(404).send('Not found'))
        .catch(err =>
        {
            console.error(err);
            res.status(500).send('Error retrieving data from database');
        })
};

module.exports =
{
    getMovies,
    getMovieById
};
