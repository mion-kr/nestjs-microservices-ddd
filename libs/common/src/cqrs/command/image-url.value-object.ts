import { PrivateSetProperty } from '../../decorators';

export class ImageUrl {
  @PrivateSetProperty
  private _url: string;

  static of(params: { url: string }): ImageUrl {
    const image = Object.assign(new this(), structuredClone(params));

    return image;
  }

  get url(): string {
    return this._url;
  }
}
