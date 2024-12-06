import { scrapingBot } from './scrap';
import { saveData } from "./saveData";

async function main () {

  await scrapingBot(process.env.URL ?? '').then( async (data) => {
  await saveData(data, 'file-name.json');
  console.log('Congratulations 🎉! I have successfully retrieved the data.');
 }).catch((error) => {
  console.error(error);
 });

}

void main();


