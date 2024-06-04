import fs from 'fs';
import csv from 'csv-parser';

async function searchCarInCSV(carName, filePath) {
  const results = [];
  const carNameWords = carName.split(' ');

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const rowValues = Object.values(row).join(' ').toLowerCase();

        // Check for exact match
        if (rowValues.includes(carName.toLowerCase())) {
          results.push(row);
        }
        // If no exact match, check for each word in the car name
        else {
          let wordMatch = true;
          for (let word of carNameWords) {
            if (!rowValues.includes(word.toLowerCase())) {
              wordMatch = false;
              break;
            }
          }
          if (wordMatch) {
            results.push(row);
          }
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

async function searchCarsInCSV(carNames, filePath) {
  const results = {};

  for (const carName of carNames) {
    results[carName] = await searchCarInCSV(carName, filePath);
  }

  return results;
}

export { searchCarsInCSV };