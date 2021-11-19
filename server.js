const express = require('express');
const { animals } = require('./data/animals');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;

const app = express();
// Parse incoming string and array data
app.use(express.urlencoded({ extended: true }));
// Parse incoming JSON data
app.use(express.json());
// Middleware to make assets public/static resources
app.use(express.static('public'));

// Filter through animals array using queries
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array. If it's a string, place it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
    }
    // Loop through each trait in the personalityTraits array
    personalityTraitsArray.forEach((trait) => {
        filteredResults = filteredResults.filter(
            (animal) => animal.personalityTraits.indexOf(trait) !== -1
        );
    });

    if (query.diet) {
        filteredResults = filteredResults.filter(
            (animal) => animal.diet === query.diet
        );
    }
    if (query.species) {
        filteredResults = filteredResults.filter(
            (animal) => animal.species === query.species
        );
    }
    if (query.name) {
        filteredResults = filteredResults.filter(
            (animal) => animal.name === query.name
        );
    }
    return filteredResults;
}

// Finds an animal by its ID
function findById(id, animalsArray) {
    const result = animalsArray.filter((animal) => animal.id === id)[0];
    return result;
}

// Create a new animal using incoming data
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    // Return finished code to post route for response
    return animal;
}

// Validates new animal request data
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

// Route for getting animals, including queries
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// Route for getting animals by ID
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Animals page route
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// Zookeepers page route
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// Wildcard route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Route for accepting new animals
app.post('/api/animals', (req, res) => {
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

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
