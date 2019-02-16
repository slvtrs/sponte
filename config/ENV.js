import { Constants } from 'expo'
import dev_env_vars from './dev_env_vars'
import stag_env_vars from './stag_env_vars'
import prod_env_vars from './prod_env_vars'

console.log(`release channel: ${Constants.manifest.releaseChannel || 'localhost'}`)
let ENV

if(!Constants.manifest.releaseChannel){
  // console.warn('using dev_env_vars')
  ENV = dev_env_vars
}
else if(Constants.manifest.releaseChannel == 'development' || Constants.manifest.releaseChannel == 'default'){
  // console.warn('using stag_env_vars')
  ENV = stag_env_vars
}
else if(Constants.manifest.releaseChannel == 'production'){
  // console.warn('using prod_env_vars')
  ENV = prod_env_vars
}

export default ENV