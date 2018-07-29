export default function (url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();

    req.overrideMimeType('application/json');
    req.open('GET', url, true);

    req.onload = function handleResponse() {
      if (this.status === 200) {
        try {
          resolve(JSON.parse(req.responseText));
        } catch (e) {
          reject(new Error(`Failed loading JSON data from '${url}'!`));
        }
      } else {
        reject(new Error(`Failed loading JSON data from '${url}'!`));
      }
    };

    req.send(null);
  });
}
