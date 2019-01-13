import {ScanRas} from '../ras/scan.ras';
import {Observable} from 'rxjs';
import {Thumbnail} from '../types/Thumbnail';

export class ScanManager {
  
  private scanRas: ScanRas;
  
  constructor() {
    this.scanRas = new ScanRas();
    return this;
  }
  
  public scan(jobName: string, filename?: string): Observable<Thumbnail> {
    return this.scanRas.sendScanRequest(jobName, filename);
  }
  
  public fetchImage(jobName: string, filename: string): Observable<string> {
    return this.scanRas.fetchImageData(jobName, filename);
  }
  
  public deleteImage(jobName: string, filename: string): Observable<string> {
    return this.scanRas.deleteImage(jobName, filename);
  }
}
