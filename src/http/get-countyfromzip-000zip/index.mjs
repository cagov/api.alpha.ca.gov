import * as fs from 'fs';
const zips = JSON.parse(fs.readFileSync('./counties.json','utf8'));

export async function handler (req) {
  const input = req.pathParameters.zip;
    
  if (input) {
      let county;
      let foundZips = [];
      zips.forEach( (item) => {
          if(input == item.zip) {
              county = item;
              console.log(county)
              foundZips.push(item)
          }
      })

      if (county) 
          return {
              statusCode: 200,
              body: JSON.stringify(foundZips),
              
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