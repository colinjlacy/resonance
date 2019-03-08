import {environment} from '../../environments/environment';
import {Thumbnail} from '../types/Thumbnail';
import {Observable} from 'rxjs';

export class ScanRas {
  private scanUrl: string;
  private imageUrl: string;
  
  constructor() {
    this.scanUrl = environment.HOST_PROTO + environment.HOST_NAME + environment.HOST_PORT + environment.SCAN_PATH;
    this.imageUrl = environment.HOST_PROTO + environment.HOST_NAME + environment.HOST_PORT + environment.IMAGE_PATH;
  }
  
  public sendScanRequest(prettyName: string, jobName: string, fileName?: string): Observable<{[key: string]: string}> {
    return Observable.create(observer => {
      fetch(this.scanUrl, {
        method: 'POST',
        body: JSON.stringify({
          foldername: jobName,
          prettyName,
          filename: fileName
        }), headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
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
  
  public deleteImage(jobName: string, fileName: string): Observable<any> {
    return Observable.create(observer => {
      fetch(`${this.imageUrl}/${jobName}/${fileName}`, {
        method: 'DELETE',
      })
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(err => observer.error(err));
    });
  }
}
