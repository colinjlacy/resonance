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
import {ConfirmationBoxComponent} from '../confirmation-box/confirmation-box.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  
  public job: JobDetails;
  public jobName: string;
  public pageName: string;
  public scannerActive: boolean;
  public emailAddress: string;
  public destination: string;
  private jobManager: JobManager;
  private scanManager: ScanManager;
  private jobSubscription: Subscription;
  private scannerActiveSubscription: Subscription;
  
  constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {
    this.jobManager = new JobManager();
    this.scanManager = new ScanManager();
  }
  
  ngOnInit() {
    this.scannerActiveSubscription = ScannerActiveService.watchScannerActivity()
      .subscribe((active: boolean) => this.scannerActive = active);
    this.jobSubscription = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.jobName = params.get('jobName');
        // TODO: how to handle errors?
        if (!!this.jobName) {
          return this.jobManager.fetchJob(this.jobName);
        }
        TitleService.setTitle('Create Scan Job');
        return of(new JobDetails());
      })
    ).subscribe((job: JobDetails) => {
      if (!!job.Name) { TitleService.setTitle(job.PrettyName || job.Name); }
      this.job = job;
    });
  }
  
  ngOnDestroy(): void {
    this.scannerActiveSubscription.unsubscribe();
    this.jobSubscription.unsubscribe();
  }
  
  clickImage(fileName: string): void {
    this.scanManager.fetchImage(this.jobName, fileName).subscribe((content: string) => {
      const dialogRef = this.dialog.open(ImageViewerComponent, {
        width: '650px',
        data: {fileName, content},
        autoFocus: false,
      });
      
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if (result && result.delete) {
          this.openConfirmationBox(`Delete Image`, `Are you sure you want to delete image ${fileName}?`)
          // @ts-ignore
            .subscribe((decision: boolean) => {
              if (!!decision) {
                if (this.job.Thumbnails.length === 1) {
                  this.deleteJob(this.job.Name);
                } else {
                  this.deleteImage(this.job.Name, fileName);
                }
              }
            });
        }
      });
    });
  }
  
  // TODO: clear form field on submit
  scan(fileCount: number = 0): void {
    ScannerActiveService.setScannerActiveState(true);
    let filename: string = !!this.pageName ? this.pageName.trim() : '';
    if (!filename.length) {
      filename = `${Date.now()}`;
    }
    this.scanManager.scan(this.job.PrettyName, this.job.Name, filename).subscribe((data: {[key: string]: string}) => {
      ScannerActiveService.setScannerActiveState(false);
      this.jobManager.refeshJobsList();
      if (!fileCount) {
        this.router.navigate(['/', data.foldername]);
      } else {
        this.jobManager.refreshJob(this.jobName);
      }
    }, (err) => {
      console.warn(err);
      ScannerActiveService.setScannerActiveState(false);
    });
  }
  
  // TODO: clear form field on submit
  email(): void {
    this.jobManager.emailJob(this.jobName, this.emailAddress)
      .subscribe(
        this.clearEmailFields.bind(this),
        (error) => console.warn(error)
      );
  }
  
  // TODO: validate request
  // TODO: clear form field on submit
  store(): void {
    this.jobManager.storeJob(this.job.Name, this.destination)
      .subscribe(
        this.clearCloudUploadPath.bind(this),
        (error) => console.warn(error)
      );
  }
  
  deleteThisJob(): void {
    this.openConfirmationBox('Delete Job', `Are you sure you want to delete scan job ${this.job.PrettyName || this.job.Name}?`)
      .subscribe((decision: boolean) => {
        if (decision) {
          this.deleteJob(this.job.Name);
        }
      });
  }
  
  private openConfirmationBox(action: string, message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '300px',
      data: {action, message},
      autoFocus: false,
    });
    return dialogRef.afterClosed();
  }
  
  private deleteImage(jobName: string, imageName: string) {
    this.scanManager.deleteImage(jobName, imageName)
      .subscribe(() => {
        // TODO: success notification
        console.log(`image ${imageName} deleted`);
        this.jobManager.refreshJob(jobName);
      });
  }
  
  private deleteJob(jobName: string) {
    this.jobManager.deleteJob(jobName)
      .subscribe(() => {
        // TODO: success notification
        console.log(`job ${jobName} deleted`);
        this.jobManager.refeshJobsList();
        this.router.navigate(['/']);
      });
  }
  
  private clearEmailFields() {
    this.emailAddress = '';
  }
  
  private clearCloudUploadPath() {
    this.destination = '';
  }
}
