const API = 'http://slvtrs.com/distagram/api.php'
const TOKEN = 'token'

let Actions = {
  getLikes(){
    return Actions.api('GET', 'likes');
  },
  addLike(){
    return Actions.api('POST', '', {add_like: true});
  },
  removeLike(){
    return Actions.api('POST', '', {remove_like: true});
  },
  api(action, model, data) {
    const url = `${API}?${model}`;
    return fetch(url, {
      body: (data ? JSON.stringify(data) : null), // must match 'Content-Type' header
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, same-origin, *omit
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json',
        // 'Authorization': TOKEN,
      },
      method: action, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // *client, no-referrer
    })
    .then((response) => {
      // console.log(response)
      return response.json()
    })
    .catch((error) => {
      console.error(error);
    });
  },
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
}

export default Actions