import * as fs from 'fs';
const foodData = JSON.parse(fs.readFileSync('./foods.json','utf8'));
import haversine from './haversine.js';

export async function handler (req) {
  if ((req.queryStringParameters && req.queryStringParameters.lat) || (req.body && req.body.lon)) {
    let position = [parseFloat(req.queryStringParameters.lon),parseFloat(req.queryStringParameters.lat)];
    let coords = { type: 'Feature', geometry: { coordinates: position } };    
    var sortedLocs = foodData.features.sort(function (a, b) {
      return haversine(coords, a, { format: 'geojson', unit: 'mile' }) - haversine(coords, b, { format: 'geojson', unit: 'mile' })
    })
    var outputLocs = [];
    for (let i = 0; i < 9; i++) {
      let food = sortedLocs[i];
      if (food) {
        food.properties.distance = haversine(coords, food, { format: 'geojson', unit: 'mile' });
        outputLocs.push(food);
      }
    }
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(outputLocs)
    };
  } else {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(foodData)
    };
  }
};