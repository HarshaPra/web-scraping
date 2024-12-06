import fs from 'fs/promises'
import * as path from 'path';

export async function saveData (data: any, fileName: string): Promise<void> {

  if (!data) {
    console.log('Data does not exist')
    return;
  }

  try {
    await fs.mkdir('data', {recursive: true});
    const filePath = path.join('data', fileName);
    await fs.writeFile(filePath, JSON.stringify(data))
  }catch (error) {
    console.error('Error saving to JSON:', error);
  }
}