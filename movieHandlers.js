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

const setMovie = (req, res) =>
{
    const { title, director, year, color, duration } = req.body;
    database
        .query("INSERT INTO movies (title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)", [title, director, year, color, duration])
        .then(([result]) => res.location(`/api/movies/${result.insertId}`).sendStatus(201))
        .catch(err =>
        {
            console.error(err);
            res.status(500).send('Error saving the movie');
        });
};
    
const updateMovie = (req, res) =>
{
    const id = Number.parseInt(req.params.id, 10),
        { title, director, year, color, duration } = req.body;
    database
        .query("UPDATE movies SET title = ?, director = ?, year = ?, color = ?, duration = ? WHERE id = ?", [title, director, year, color, duration, id])
        .then(([result]) =>
        {
            if (result.affectedRows) res.sendStatus(204);
            else res.status(404).send('Movie not found');
        })
        .catch(err =>
        {
            console.error(err);
            res.status(500).send('Error editing the movie');
        });
};

const deleteMovie = (req, res) =>
{
    const id = Number.parseInt(req.params.id, 10);
    database
        .query("DELETE FROM movies WHERE id = ?", [id])
        .then(([result]) =>
        {
            if (result.affectedRows) res.sendStatus(204);
            else res.status(404).send('Movie not found');
        })
        .catch(err =>
        {
            console.error(err);
            res.status(500).send('Error removing the movie');
        });
}
    
module.exports =
{
    getMovies,
    getMovieById,
    setMovie,
    updateMovie,
    deleteMovie
};
