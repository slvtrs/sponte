const DEV = false
const PROD = false

const HOST = 'heroku.com'
const ROOT = `https://${HOST}/`
const CABLE = `wss://${HOST}/cable`

const ENV = {
  DEV: DEV,
  PROD: PROD,
  ROOT: ROOT,
  API: `${ROOT}api/v1/`,
  CABLE: CABLE,
  HOST: HOST,
}

export default ENV