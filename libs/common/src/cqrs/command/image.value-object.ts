import { PrivateSetProperty } from '../../decorators';

export class Image {
  @PrivateSetProperty
  private _imageUrl: string;

  static of(params: { imageUrl: string }): Image {
    const image = Object.assign(new this(), params);

    return image;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }
}
