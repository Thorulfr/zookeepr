const fs = require('fs');
const path = require('path');

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
        path.join(__dirname, '../data/animals.json'),
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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal,
};
