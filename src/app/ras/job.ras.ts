import {Observable, Subject} from 'rxjs';
import {JobSummary} from '../types/JobSummary';
import {environment} from '../../environments/environment';
import {JobDetails} from '../types/JobDetails';

const jobsList: Subject<JobSummary[]> = new Subject<JobSummary[]>();
const job: Subject<JobDetails> = new Subject<JobDetails>();

export class JobRas {
  
  private jobsUrl: string;
  private jobUrl: string;
  private emailUrl: string;
  private storeUrl: string;
  
  constructor() {
    this.jobsUrl = environment.HOST_PROTO + environment.HOST_NAME + environment.HOST_PORT + environment.JOBS_PATH;
    this.jobUrl = environment.HOST_PROTO + environment.HOST_NAME + environment.HOST_PORT + environment.JOB_PATH;
    this.emailUrl = environment.HOST_PROTO + environment.HOST_NAME + environment.HOST_PORT + environment.EMAIL_PATH;
    this.storeUrl = environment.HOST_PROTO + environment.HOST_NAME + environment.HOST_PORT + environment.STORE_PATH;
  }
  
  public watchJobsList(): Subject<JobSummary[]> {
    return jobsList;
  }
  
  public fetchLatestJobs(): void {
    fetch(this.jobsUrl)
      .then(response => response.json()) // or text() or blob() etc.
      .then(data => jobsList.next(data.jobs))
      .catch((err: Error) => console.log(err));
  }
  
  public fetchJob(jobName: string): void {
    fetch(`${this.jobUrl}/${jobName}`)
      .then(response => response.json()) // or text() or blob() etc.
      .then(data => job.next(data))
      .catch((err: Error) => console.log(err));
  }
  
  public watchJob(): Observable<JobDetails> {
    return job;
  }
  
  public emailJob(jobName: string, email: string): Observable<any> {
    return Observable.create(observer => {
      fetch(this.emailUrl, {
        method: 'POST',
        body: JSON.stringify({
          foldername: jobName,
          emailAddress: email
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
  
  // TODO: error handling isn't working
  public storeJob(foldername: string, destination: string): Observable<any> {
    return Observable.create(observer => {
      fetch(this.storeUrl, {
        method: 'POST',
        body: JSON.stringify({ foldername, destination }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(err => observer.error(err));
    });
  }
  
  public deleteJob(jobName: string): Observable<any> {
    return Observable.create(observer => {
      fetch(`${this.jobUrl}/${jobName}`, {
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
