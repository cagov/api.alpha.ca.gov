import * as fs from 'fs';
const holidaydates = JSON.parse(fs.readFileSync('./holidaydates.json','utf8'))
const holidaylang = JSON.parse(fs.readFileSync('./holidaylang.json','utf8'))
holidaydates.forEach(x => x["dateobject"]=new Date(x.date+" PST"))
holidaydates.sort((a,b) => a.dateobject-b.dateobject)

export async function handler (req) {
  const icalUrl = 'https://calendar.google.com/calendar/ical/alpha.ca.gov_m9372uj21m6qdgrqg4olkdgo4c%40group.calendar.google.com/public/basic.ics'

let lang = 'en';
if(req.queryStringParameters && req.queryStringParameters.lang) {
    lang = req.queryStringParameters.lang;
}

const translate=text=>lang?holidaylang.find(x=>x.en===text)[lang]||text:text

switch ((req.pathParameters.route || "").toLowerCase()) {
case '.ics':
  const https = require('https')
  https.get(icalUrl, response => {

      let body = ''
      let i = 0
      response.on('data', function (chunk) {
          i++
          body += chunk
      })
      response.on('end', function () {
          return { 
              isRaw: 'true', 
              body,
              headers: {
                  'Content-Disposition' : 'attachment; filename="California State Holidays.ics"',
                  'Content-Type' : 'text/calendar',
                  'Cache-Control' : 'public, max-age=84600' //1 day
              }
          }
      })
  })
  break
case 'next':
//Date docs here...
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
  const server_now = new Date()
  const nextrow = holidaydates.filter(x=>x.dateobject>server_now)[0]
  const next = nextrow.dateobject
  const name = translate(nextrow.name)
  const locales = 'en-US'

  const month_name = next.toLocaleDateString(locales, { month: 'long' })
  const month = parseInt(next.toLocaleDateString(locales, { month: 'numeric' }))
  const day_of_month = parseInt(next.toLocaleDateString(locales, { day: 'numeric' }))
  const day_of_week = next.toLocaleDateString(locales, { weekday: 'long' })
  const date = next.toLocaleDateString(locales, { 
      year: 'numeric', month: 'numeric', day: 'numeric'
   })
  const server_time_zone = server_now.toLocaleDateString(locales, { timeZoneName: 'long' })
  const date_full = next.toLocaleDateString(locales, { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return {
    statusCode: 200,
      body: JSON.stringify({
          date,
          date_iso:next.toISOString(),
          name,
          date_full,
          day_of_week,
          month_name,month, 
          day_of_month,
          year:next.getUTCFullYear(),
          server_time_zone,
          server_now
      }),
      headers: {
          'Content-Type' : 'application/json',
          'Cache-Control' : 'public, max-age=84600' //1 day
      }
  }
  break
case 'all':
  return {
    statusCode: 200,
      body:
          JSON.stringify(holidaydates.map(x=>({"name":translate(x.name),"date":x.dateobject})))
      ,
      headers: {
          'Content-Type' : 'application/json',
          'Cache-Control' : 'public, max-age=84600' //1 day
      }
  }
  break
default:
  return {
      statusCode: 404,
      body: "Nothing to do (try '/next' or '/.ics' or '/all')"
  }
  break
}

context.done()

}


