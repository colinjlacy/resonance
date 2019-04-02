import {MatSnackBar} from '@angular/material';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';

const snackbarSubject: Subject<{message: string, action: string, time: number}> = new Subject();

@Injectable()
export class SnackbarService {
  
  constructor(private snackBar: MatSnackBar) {
    snackbarSubject.subscribe(this.snackBarWatcher.bind(this));
  }
  
  public static openSnackBar(message: string, action: string, duration?: number): void {
    const time = duration || 3000;
    snackbarSubject.next({message, action, time});
  }
  
  private snackBarWatcher(obj: {message: string, action: string, time: number}): void {
    this.snackBar.open(obj.message, obj.action, { duration: obj.time });
  }
  
}
