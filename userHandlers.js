const database = require('./database');

// Check whether the id is a number
const isNumber = (number) =>
{
    return !Number.isNaN(number);
};

// Get users
const getUsers = (req, res) =>
{
    const id = Number.parseInt(req.params.id, 10),
        query = isNumber(id) ? "SELECT * FROM users WHERE id = ?" : "SELECT * FROM users",
        preparedStatements = isNumber(id) ? [id] : [];
    database
        .query(query, preparedStatements)
        .then(([users]) =>
        {
            if (isNumber(id)) users[0] ? res.json(users[0]) : res.status(404).send('Not found');
            else res.json(users);
        })
        .catch(err =>
        {
            console.error(err);
            res.status(500).send('Error retrieving data from database');
        });
};

module.exports = { getUsers };