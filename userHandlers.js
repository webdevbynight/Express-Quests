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
        language = req.query.language ? req.query.language : null,
        city = req.query.city ? req.query.city : null,
        query = isNumber(id) ? "SELECT * FROM users WHERE id = ?" : "SELECT * FROM users",
        preparedStatements = isNumber(id) ? [id] : [],
        queryClauses = [];
    if (!isNumber(id))
    {
        if (language !== null)
        {
            preparedStatements.push(language);
            queryClauses.push({ column: 'language', value: language, operator: '=' });
        }
        if (city !== null)
        {
            preparedStatements.push(city);
            queryClauses.push({ column: 'city', value: city, operator: '=' });
        }
    }
    database
        .query
        (
            queryClauses.length ? queryClauses.reduce((sql, { column, operator }, index) => `${sql} ${index === 0 ? "WHERE" :  "AND"} ${column} ${operator} ?`, query) : query,
            preparedStatements
        )
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

// Set user
const setUser = (req, res) =>
{
    const { firstName, lastName, email, city, language } = req.body;
    database
        .query("INSERT INTO users (firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)", [firstName, lastName, email, city, language])
        .then(([result]) => res.location(`/api/users/${result.insertId}`).sendStatus(201))
        .catch(err =>
        {
            console.error(err);
            res.status(500).send('Error saving the user');
        });
};

// Update user
const updateUser = (req, res) =>
{
    const id = Number.parseInt(req.params.id, 10),
        { firstName, lastName, email, city, language } = req.body;
    database
        .query("UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id = ?", [firstName, lastName, email, city, language, id])
        .then(([result]) =>
        {
            if (result.affectedRows) res.sendStatus(204);
            else res.status(404).send('User not found');
        })
        .catch(err =>
        {
            console.error(err);
            res.status(500).send('Error saving the user');
        });
};

// Delete user
const deleteUser = (req, res) =>
{
    const id = Number.parseInt(req.params.id, 10);
    database
        .query("DELETE FROM users WHERE id = ?", [id])
        .then(([result]) =>
        {
            if (result.affectedRows) res.sendStatus(204);
            else res.status(404).send('User not found');
        })
        .catch(err =>
        {
            console.error(err);
            res.status(500).send('Error removing the user');
        });
}

module.exports =
{
    getUsers,
    setUser,
    updateUser,
    deleteUser
};