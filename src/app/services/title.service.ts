import {Observable, Subject} from 'rxjs';

const title: Subject<string> = new Subject();

export class TitleService {
  
  public static setTitle(newTitle: string): void {
    title.next(newTitle);
  }
  
  public static watchTitle(): Observable<string> {
    return title;
  }
  
}
