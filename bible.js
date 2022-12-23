import https from 'https';
import fetch from 'node-fetch';

// https.get('https://quotes.rest/bible/verse.json', async (res, body) => {
//   let data = '';

//   // A chunk of data has been received.
//   res.on('data', (chunk) => {
//     data += chunk;
//   });
//   console.log(data);

//   // The whole response has been received. Print out the result.
//   res.on('end', () => {
//     console.log(JSON.parse(data).explanation);
//   });
// });
const fetchBibleVerse = async () => {
  const response = await fetch(
    'https://labs.bible.org/api/?passage=random&type=json'
  );
  const body = await response.json();

  return [body[0].text, body[0].bookname, body[0].chapter, body[0].verse];
};

export { fetchBibleVerse };
