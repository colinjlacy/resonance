import {Observable, Subject} from 'rxjs';

const scannerActive: Subject<boolean> = new Subject();

export class ScannerActiveService {
  
  public static setScannerActiveState(active: boolean): void {
    scannerActive.next(active);
  }
  
  public static watchScannerActivity(): Observable<boolean> {
    return scannerActive;
  }
  
}
