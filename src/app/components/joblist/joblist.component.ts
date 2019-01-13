import {Component, OnInit, OnDestroy} from '@angular/core';
import {JobSummary} from '../../types/JobSummary';
import {JobManager} from '../../managers/job.manager';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {ActiveRouterState} from '../../app.route-serializer';

@Component({
  selector: 'app-joblist',
  templateUrl: './joblist.component.html',
  styleUrls: ['./joblist.component.scss']
})
export class JoblistComponent implements OnInit, OnDestroy {
  
  public jobs$: Observable<JobSummary[]>;
  private activeJobSubscription: Subscription;
  private activeJob: string;
  private jobManager: JobManager;
  
  constructor(private router: Router, private store: Store<ActiveRouterState>) {
    this.jobManager = new JobManager();
    this.activeJob = '';
  }
  
  ngOnInit() {
    this.jobManager.refeshJobsList();
    this.jobs$ = this.jobManager.watchJobsList();
    this.activeJobSubscription = this.store.select('router')
      .subscribe((val: ActiveRouterState) => this.activeJob = val.state.params.jobName);
  }
  
  ngOnDestroy() {
    this.activeJobSubscription.unsubscribe();
  }
  
  navigateToJob(jobName: string) {
    this.router.navigate([jobName]);
  }
  
}
