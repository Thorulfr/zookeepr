const router = require('express').Router();
const {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal,
} = require('../../lib/animals');
const { animals } = require('../../data/animals');

// Route for getting animals, including queries
router.get('/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// Route for getting animals by ID
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
});

// Route for accepting new animals
router.post('/animals', (req, res) => {
    // req.body is where the incoming content is
    // Set ID based on what next index of the array will bear
    req.body.id = animals.length.toString();
    // If any data in req.body is incorrect, send back 400 error
    if (!validateAnimal(req.body)) {
        res.status(400).send('Your animal data is not properly formatted.');
    } else {
        // Add animal to JSON file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

module.exports = router;
