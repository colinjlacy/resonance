import { Component, OnInit, OnDestroy } from '@angular/core';
import {TitleService} from '../../services/title.service';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {ActiveRouterState, RouterStateUrl} from '../../app.route-serializer';
import {Router} from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  
  public title: string;
  private titleSubscription: Subscription;
  private routerStoreSubscription: Subscription;
  private routerState: ActiveRouterState;
  
  constructor(private store: Store<ActiveRouterState>, private router: Router) {
    this.title = '';
  }

  ngOnInit() {
    this.titleSubscription = TitleService.watchTitle()
      .subscribe((title: string) => this.title = title);
    this.routerStoreSubscription = this.store.select('router').subscribe((val: ActiveRouterState) => {
      this.routerState = val;
    });
  }
  
  ngOnDestroy(): void {
    this.titleSubscription.unsubscribe();
    this.routerStoreSubscription.unsubscribe();
  }
  
  isActive(targetPaths: string[]): boolean {
    return targetPaths.join('') === this.routerState.state.url;
  }
  
  navigate(targetPaths: string[]): void {
    this.router.navigate(targetPaths);
  }
  
}
