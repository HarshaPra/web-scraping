import axios from "axios";
import * as cheerio from "cheerio";

interface Models {
  brandName: string;
  models: {model: string, category: string}[];
}

export async function scrapingBot(url: string): Promise<Models[]> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const brandPromises = $('.carman').map(async (_, element) => {
      const brandName = $(element).find('h5 span[itemprop="name"]').text().trim();
      const modelUrl = $(element).find('h5 a').attr('href');

      if (brandName && modelUrl) {
        try {
          const modelResponse = await axios.get(modelUrl);
          const $modelPage = cheerio.load(modelResponse.data);
          const models = $modelPage('.carmod').map((_, modelElement) => {
            const $model = $modelPage(modelElement);
            return {
              model: $model.find('h4').text(),
              category: $model.find('p.body').text()
            };
          }).get(); 

          return { brandName, models };
        } catch (modelError) {
          console.error(`Error fetching models for ${brandName}:`, modelError);
          return { brandName, models: [] };
        }
      }
      return null;
    }).get();

    const brands = await Promise.all(brandPromises);
    return brands.filter((brand): brand is Models => brand !== null);

  } catch (error) {
    throw error;
  }
}