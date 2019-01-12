import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Observable, of, Subscription} from 'rxjs';
import {JobDetails} from '../../types/JobDetails';
import {JobManager} from '../../managers/job.manager';
import {ScanManager} from '../../managers/scan.manager';
import {TitleService} from '../../services/title.service';
import {ImageViewerComponent} from '../image-viewer/image-viewer.component';
import {MatDialog} from '@angular/material';
import {ScannerActiveService} from '../../services/scanner-active.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  
  private job$: Observable<JobDetails>;
  private jobName: string;
  private pageName: string;
  private jobManager: JobManager;
  private scanManager: ScanManager;
  private scannerActiveSubscription: Subscription;
  private scannerActive: boolean;
  private emailAddress: string;
  
  constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {
    this.jobManager = new JobManager();
    this.scanManager = new ScanManager();
  }
  
  ngOnInit() {
    this.scannerActiveSubscription = ScannerActiveService.watchScannerActivity()
      .subscribe((active: boolean) => this.scannerActive = active );
    this.job$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.jobName = params.get('jobName');
        // TODO: how to handle errors?
        if (!!this.jobName) {
          TitleService.setTitle(this.jobName);
          return this.jobManager.fetchJob(this.jobName);
        }
        TitleService.setTitle('Create Scan Job');
        return of(new JobDetails());
      })
    );
  }
  
  ngOnDestroy(): void {
    this.scannerActiveSubscription.unsubscribe();
  }
  
  clickImage(fileName: string): void {
    this.scanManager.fetchImage(this.jobName, fileName).subscribe((content: string) => {
      const dialogRef = this.dialog.open(ImageViewerComponent, {
        width: '650px',
        data: {fileName, content}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
      });
    });
    
  }
  
  scan(fileCount: number = 0): void {
    ScannerActiveService.setScannerActiveState(true);
    let filename: string = !!this.pageName ? this.pageName.trim() : '';
    if (!filename.length) { filename = `page-${fileCount + 1}`; }
    this.scanManager.scan(this.jobName, filename).subscribe(() => {
      ScannerActiveService.setScannerActiveState(false);
      this.jobManager.refeshJobsList();
      if (!fileCount) {
        this.router.navigate(['/', this.jobName]);
      } else {
        this.jobManager.updateJob(this.jobName);
      }
    }, (err) => {
      console.warn(err);
      ScannerActiveService.setScannerActiveState(false);
    });
  }
  
  email(): void {
    this.jobManager.emailJob(this.jobName, this.emailAddress).subscribe(() => console.log('success!'), (error) => console.warn(error));
  }
}
