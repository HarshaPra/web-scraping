import {scrapingBot} from './scrap';
import {saveData} from "./saveData";

async function main () {

  // https://www.autoevolution.com/cars/

 const data = await scrapingBot('https://www.autoevolution.com/cars/');

 if(data) {
  await saveData(data, 'cars.json')
 }

}

void main();


