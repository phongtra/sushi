import { Storage } from '@google-cloud/storage';
import path from 'path';

class GoogleStorageConnect {
  private gc: Storage;
  connect() {
    this.gc = new Storage({
      keyFilename: path.join(__dirname, '../../sushi-295208-35d1d939e4de.json'),
      projectId: 'recipes-images1'
    });
  }

  get bucket() {
    if (!this.gc) {
      throw new Error('There is no google cloud storage connection');
    }
    const recipeImages = this.gc.bucket('recipes-images1');
    return recipeImages;
  }
}

export const googleStorageConnect = new GoogleStorageConnect();
