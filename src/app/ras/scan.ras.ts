import {environment} from '../../environments/environment';
import {Thumbnail} from '../types/Thumbnail';
import {from, Observable} from 'rxjs';
import {first, map} from 'rxjs/operators';

export class ScanRas {
  private scanUrl: string;
  private imageUrl: string;
  
  constructor() {
    this.scanUrl = environment.HOST_PROTO + environment.HOST_NAME + environment.HOST_PORT + environment.SCAN_PATH;
    this.imageUrl = environment.HOST_PROTO + environment.HOST_NAME + environment.HOST_PORT + environment.IMAGE_PATH;
  }
  
  public sendScanRequest(jobName: string, fileName?: string): Observable<Thumbnail> {
    return Observable.create(observer => {
      fetch(this.scanUrl, {
        method: 'POST',
        body: JSON.stringify({
          foldername: jobName,
          filename: fileName
        })
      })
        .then(response => response.json()) // or text() or blob() etc.
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(err => observer.error(err));
    });
  }
  
  public fetchImageData(jobName: string, fileName: string): Observable<string> {
    return Observable.create(observer => {
      fetch(`${this.imageUrl}/${jobName}/${fileName}`)
        .then(response => response.json()) // or text() or blob() etc.
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(err => observer.error(err));
    });
  }
}
