export class JobSummary {
  private _Name: string;
  private _PrettyName: string;
  private _FileCount: number;
  private _Date: Date;
  private _Expires: Date;

  constructor(init?: any) {
    if (!!init && !!init._Name) { this._Name = init.name; }
    if (!!init && !!init._PrettyName) { this._PrettyName = init._PrettyName; }
    if (!!init && !!init._FileCount) { this._FileCount = init._FileCount; }
    if (!!init && !!init._Date) { this._Date = new Date(init._Date); }
    if (!!init && !!init._Expires) { this._Expires = new Date(init._Expires); }
    return this;
  }
  
  get Name(): string {
    return this._Name;
  }
  
  set Name(value: string) {
    this._Name = value;
  }
  
  get PrettyName(): string {
    return this._PrettyName;
  }
  
  set PrettyName(value: string) {
    this._PrettyName = value;
  }
  
  get FileCount(): number {
    return this._FileCount;
  }
  
  set FileCount(value: number) {
    this._FileCount = value;
  }
  
  get Date(): Date {
    return this._Date;
  }
  
  set Date(value: Date) {
    this._Date = value;
  }
  
  get Expires(): Date {
    return this._Expires;
  }
  
  set Expires(value: Date) {
    this._Expires = value;
  }
}
