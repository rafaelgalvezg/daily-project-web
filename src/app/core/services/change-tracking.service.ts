import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';
import {ChangeTracking} from '../models/changeTracking.model';

@Injectable({
  providedIn: 'root'
})
export class ChangeTrackingService {

  constructor(private http: HttpClient) {
  }

  private apiUrl = `${environment.apiBaseUrl}/api/v1/tracking`;

  getTrackingByTask(idTask: number){
    return this.http.get<ChangeTracking[]>(`${this.apiUrl}/task/${idTask}`);
  }

}
