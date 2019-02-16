let DEV = true
  // DEV = false // uncomment to use staging
let PROD = false
  // PROD = true // uncomment to use production

let IP = 'localhost'
  IP = '192.168.43.248'
let HOST = `${IP}:3000`
  // HOST = 'b579d7c7.ngrok.io'
let ROOT = `http://${HOST}/`
let CABLE = `ws://${HOST}/cable`

if (!DEV) {
  // HOST = 'heroku.com'
  ROOT = `https://${HOST}/`
  CABLE = `wss://${HOST}/cable`
}
if (PROD) {
  // HOST = 'heroku.com'
  ROOT = `https://${HOST}/`
  CABLE = `wss://${HOST}/cable`
}

const ENV = {
  DEV: DEV,
  PROD: PROD,
  ROOT: ROOT,
  API: `${ROOT}/`,
  CABLE: CABLE,
  HOST: HOST,
}

export default ENV
