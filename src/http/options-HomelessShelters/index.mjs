// learn more about HTTP functions here: https://arc.codes/http
export async function handler (req) {
  return {
    statusCode: 204,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*'
    },
  }
}