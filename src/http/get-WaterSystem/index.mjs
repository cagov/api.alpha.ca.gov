import topRightSystems from './water-systems-top-right.json' assert { type: 'json' };
import topLeftSystems from './water-systems-top-left.json' assert { type: 'json' };
import bottomSystems from './water-systems-bottom.json' assert { type: 'json' };
import geolib from 'geolib';
import allSystems from './all-water-systems-list.json' assert { type: 'json' };
let systemMap = new Map();
allSystems.forEach( (system) => {
  systemMap.set(system['Water System No'],system);
})

export async function handler (req) {
  let respBody= [];
  let latitude, longitude;
  if(req.queryStringParameters.lat) {
    latitude = req.queryStringParameters.lat;
    longitude = req.queryStringParameters.lon;
  }
  if (req.queryStringParameters.stringLoc) {
    let point = await geocode(req.queryStringParameters.stringLoc)
    latitude = point.latitude;
    longitude = point.longitude;
  }
  if(latitude) {
    // we have a point, find the corresponding systems
    let uniqueFoundSystems = new Map();

    let midPoint = 37.046741;
    let leftOfSac = -121.868589;
    let systemGeoJson = bottomSystems;
    if(latitude >= midPoint) {
      // systemGeoJson = topSystems;
      if(longitude >= leftOfSac) {
        systemGeoJson = topLeftSystems;
      } else {
        systemGeoJson = topRightSystems;
      }
    }
    systemGeoJson.features.forEach( (system) => {
      if(system.geometry) {
        let inPolygon = false;
        system.geometry.coordinates.forEach( (shapeSet) => {
          shapeSet.forEach( (shapePoints) => {
            let refinedGeometry = [];
            shapePoints.forEach( (shape) => {
              let obj = {}
              obj.latitude = shape[1];
              obj.longitude = shape[0];
              refinedGeometry.push(obj);  
            })
            inPolygon = geolib.isPointInPolygon({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) }, refinedGeometry);
            if(inPolygon) {
              uniqueFoundSystems.set(system.properties.pwsid,system)
            }
          })
        })
      }
    })
    uniqueFoundSystems.forEach( (sys) => {
      if(systemMap.get(sys.properties.pwsid)) {
        sys.properties.systemData = systemMap.get(sys.properties.pwsid);
      }
      respBody.push(sys)
    })
    return {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(respBody)
    };
  } else {
    if(req.queryStringParameters.systemId) {
      let system = {
        type: "Feature",
        properties: {}
      }
      system.properties.systemData = systemMap.get(req.queryStringParameters.systemId);
      system.properties.pwsid = system.properties.systemData['Water System No'];
      system.properties.name = system.properties.systemData['Water System Name'];
      respBody.push(system)
      
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(respBody)
      };  
    } else {
      return {
        status: 400,
        body: "Please pass a lat and lon on the query string"
      };  
    }
  }
};


async function geocode(query) {
  /*
  The following local.settings.json file is required for this to work...
  
  {
      ...
      "Values": {
          ...
          "FUNCTIONS_MAP_KEY": "(Insert "Azure Authentication Shared Key" here )"
      }
  }
  */
  
  const apikey = process.env["FUNCTIONS_MAP_KEY"]

  if(!apikey)
      throw Error("Api key (FUNCTIONS_MAP_KEY) is missing from configuration.  See source comment for help.")

  const geolink = `https://atlas.microsoft.com/search/address/json?subscription-key=${apikey}&api-version=1.0&limit=1&countrySet=US&extendedPostalCodesFor=None&topLeft=42,-124.5&btmRight=32.5,-114.1&query=`
// Getcoder docs - https://docs.microsoft.com/en-us/rest/api/maps/search/getsearchaddress

  const georesponse =  await fetch(geolink+encodeURIComponent(query))
  if (georesponse.ok) {
      const geojson = await georesponse.json()
      const georesult =  geojson.summary.numResults>0 ? geojson.results[0] : null
      if(georesult && georesult.address.countrySubdivision=="CA")
          return {latitude: georesult.position.lat, longitude:georesult.position.lon, match: georesult.address.freeformAddress}
  }
}