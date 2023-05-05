require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

const port = process.env.APP_PORT ?? 8000;

const welcome = (req, res) => res.send('Welcome to my favourite movie list');

app.get('/', welcome);

const movieHandlers = require('./movieHandlers'),
    userHandlers = require('./userHandlers');

app.get('/api/movies', movieHandlers.getMovies);
app.get('/api/movies/:id', movieHandlers.getMovieById);
app.get('/api/users', userHandlers.getUsers);
app.get('/api/users/:id', userHandlers.getUsers);
app.post('/api/movies', movieHandlers.setMovie);
app.post('/api/users', userHandlers.setUser);
app.put('/api/movies/:id', movieHandlers.updateMovie);
app.put('/api/users/:id', userHandlers.updateUser);
app.delete('/api/movies/:id', movieHandlers.deleteMovie);
app.delete('/api/users/:id', userHandlers.deleteUser);

app.listen(port, err =>
{
    if (err) console.error('Something bad happened');
    else console.log(`Server is listening on ${port}`);
});
