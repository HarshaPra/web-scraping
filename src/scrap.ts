import axios from "axios";
import * as cheerio from "cheerio";

interface CarBrand {
  brandName: string;
  models: string[];
}

export async function scrapingBot(url: string): Promise<CarBrand[]> {
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
          const models = $modelPage('.carmod h4').map((_, modelElement) =>
            $modelPage(modelElement).text().trim()
          ).get();

          return { brandName, models };
        } catch (modelError) {
          console.error(`Error fetching models for ${brandName}:`, modelError);
          return { brandName, models: [] };
        }
      }
      return null;
    }).get();

    const brands = await Promise.all(brandPromises);
    return brands.filter((brand): brand is CarBrand => brand !== null);

  } catch (error) {
    console.error('Error in scrapingBot:', error);
    throw error;
  }
}