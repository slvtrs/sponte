const DEV = false
const PROD = true

const HOST = 'sponte.herokuapp.com'
const ROOT = `https://${HOST}/`
const CABLE = `wss://${HOST}/cable`

const ENV = {
  DEV: DEV,
  PROD: PROD,
  ROOT: ROOT,
  API: `${ROOT}`,
  CABLE: CABLE,
  HOST: HOST,
}

export default ENV