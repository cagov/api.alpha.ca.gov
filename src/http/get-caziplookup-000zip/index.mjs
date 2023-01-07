import * as fs from 'fs';
const zips = JSON.parse(fs.readFileSync('./data.json','utf8'));

export async function handler (req) {
  console.log(req)
  const input = req.pathParameters.zip;

  if (input) {
      let cities = [];
      for (const ziprow of zips) {
          cities = ziprow[input];
          if (cities) break;
      }

      if (cities) 
          return {
            statusCode: 200,
            body: JSON.stringify({"zip":input, "cities":cities.map(cityname => ({"name" : cityname} ))}),
            headers: {
                'Content-Type' : 'application/json',
                "Cache-Control" : "public, max-age=84600" //1 day
            }
          };
      else 
          return {
            statusCode: 404,
              body: "Zip not found - " + input
          };
  } else 
      return {
        statusCode: 400,
          body: "Please pass a zip on the path"
      };
};