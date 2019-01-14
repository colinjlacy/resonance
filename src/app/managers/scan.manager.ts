import {ScanRas} from '../ras/scan.ras';
import {Observable} from 'rxjs';
import {Thumbnail} from '../types/Thumbnail';
import {FormattingEngine} from '../engines/formatting.engine';

export class ScanManager {
  
  private scanRas: ScanRas;
  
  constructor() {
    this.scanRas = new ScanRas();
    return this;
  }
  
  public scan(prettyName: string, jobName?: string, filename?: string): Observable<{[key: string]: string}> {
    let validJobName: string;
    if (!jobName) {
      validJobName = FormattingEngine.convertToFileSafe(prettyName);
    } else {
      validJobName = jobName;
    }
    return this.scanRas.sendScanRequest(prettyName, validJobName, filename);
  }
  
  public fetchImage(jobName: string, filename: string): Observable<string> {
    return this.scanRas.fetchImageData(jobName, filename);
  }
  
  public deleteImage(jobName: string, filename: string): Observable<string> {
    return this.scanRas.deleteImage(jobName, filename);
  }
}
