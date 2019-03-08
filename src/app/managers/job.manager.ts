import {JobRas} from '../ras/job.ras';
import {Observable, Subject} from 'rxjs';
import {JobSummary} from '../types/JobSummary';
import {JobDetails} from '../types/JobDetails';

export class JobManager {

  private jobRas: JobRas;

  constructor() {
    this.jobRas = new JobRas();
  }

  public watchJobsList(): Subject<JobSummary[]> {
    return this.jobRas.watchJobsList();
  }

  public refeshJobsList(): void {
    this.jobRas.fetchLatestJobs();
  }
  
  public fetchJob(jobName: string): Observable<JobDetails> {
    this.jobRas.fetchJob(jobName);
    return this.jobRas.watchJob();
  }
  
  public refreshJob(jobName: string): void {
    this.jobRas.fetchJob(jobName);
  }
  
  public emailJob(jobName: string, email: string): Observable<any> {
    return this.jobRas.emailJob(jobName, email);
  }
  
  public storeJob(jobName: string, destination: string): Observable<any> {
    return this.jobRas.storeJob(jobName, destination);
  }
  
  public deleteJob(jobName: string): Observable<any> {
    return this.jobRas.deleteJob(jobName);
  }
}
