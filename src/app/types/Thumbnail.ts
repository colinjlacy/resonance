export class Thumbnail {
  private _Name: string;
  private _Content: string;
  
  constructor(init?: any) {
    if (!!init && !!init.name) { this._Name = init.name; }
    if (!!init && !!init.content) { this._Content = init.content; }
    return this;
  }
  
  get Name(): string {
    return this._Name;
  }
  
  set Name(value: string) {
    this._Name = value;
  }
  
  get Content(): string {
    return this._Content;
  }
  
  set Content(value: string) {
    this._Content = value;
  }
}
