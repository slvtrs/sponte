import ENV from 'config/ENV'
import { Constants } from 'expo';

let apiActions = {
  getCats(count=1){
    return fetch(`https://api.thecatapi.com/v1/images/search?format=json${count ? (`&limit=${count}`) : ''}`, {
      headers: {
        'content-type': 'application/json',
        'x-api-key': 'https://api.thecatapi.com/v1/images/search?format=json',
      },
      method: 'GET'
    }).then((response) => response.json())
    .catch((error) => console.error(error));
  },
  async request(model, action="GET", data=null, retry=0, multipart=false){
    const token = Constants.installationId
    const url = ENV.API + model;
    const options = {
      body: multipart ? (data || null) : (data ? JSON.stringify(data) : null), // must match 'Content-Type' header
      // body: data ? JSON.stringify(data) : null, // must match 'Content-Type' header
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, same-origin, *omit
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': (multipart ? 'multipart/form-data' : 'application/json'),
        // 'content-type': 'application/json',
        'Authorization': token,
        'x-app-version': Constants.manifest.version,
      },
      method: action, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // *client, no-referrer
    }
    return apiActions.fetchRetry(url, options, retry)
      .then((response) => response.json())
      .catch((error) => {
        console.warn(error);
      });
  },
  fetchRetry(url, options, n) {
    // https://dev.to/ycmjason/javascript-fetch-retry-upon-failure-3p6g
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then((response) => {
          const contentType = response.headers.get("content-type");
          if(contentType && contentType.indexOf("application/json") !== -1) {
            resolve(response);
          }
          else {
            console.warn(`response is not json. ${n} retries left`)
            if(n === 0) return reject(`Network not found`);
            apiActions.fetchRetry(url, options, n - 1)
              .then(resolve)
              .catch(reject);
          }
        })
        .catch((error) => {
          console.log(`failed fetch attemp with ${n} retries left`)
          if(n === 0) return reject(error);
          apiActions.fetchRetry(url, options, n - 1)
            .then(resolve)
            .catch(reject);
        });
    })
  },
}

export default apiActions