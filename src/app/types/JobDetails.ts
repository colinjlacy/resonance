import {JobSummary} from './JobSummary';
import {Thumbnail} from './Thumbnail';

export class JobDetails extends JobSummary {
  
  private _Thumbnails: Array<Thumbnail>;
  
  constructor(init?: any) {
    super(init);
    if (!!init && !!init._Thumbnails) { this._Thumbnails = init._Thumbnails; }
    return this;
  }
  
  get Thumbnails(): Array<Thumbnail> {
    return this._Thumbnails;
  }
  
  set Thumbnails(value: Array<Thumbnail>) {
    this._Thumbnails = value;
  }
}
