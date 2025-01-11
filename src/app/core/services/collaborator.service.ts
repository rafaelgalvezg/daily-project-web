import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {environment} from '../../../environments/environment.development';
import {Collaborator} from '../models/collaborator.model';
import {Page} from '../models/pageable.model';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {

  constructor(private http: HttpClient) { }
  private collaboratorSubject: Subject<Page<Collaborator>> = new Subject<Page<Collaborator>>();
  private messageSubject: Subject<string> = new Subject<string>();

  private apiUrl = `${environment.apiBaseUrl}/api/v1/collaborators`;

  getCollaborators(page: number = 0, size: number = 5, sort: string = 'idCollaborator,desc'){
    return this.http.get<Page<Collaborator>>(`${this.apiUrl}?page=${page}&size=${size}&sort=${sort}`);
  }

  getCollaborator(id: number){
    return this.http.get<Collaborator>(`${this.apiUrl}/${id}`);
  }

  createCollaborator(collaborator: Collaborator){
    return this.http.post<Collaborator>(this.apiUrl, collaborator);
  }

  updateCollaborator(collaborator: Collaborator){
    return this.http.put<Collaborator>(`${this.apiUrl}/${collaborator.idCollaborator}`, collaborator);
  }

  deleteCollaborator(id: number){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getCollaboratorsSubject(){
    return this.collaboratorSubject.asObservable();
  }

  setCollaboratorsSubject(collaborators: Page<Collaborator>){
    this.collaboratorSubject.next(collaborators);
  }

  getMessageSubject(){
    return this.messageSubject.asObservable()
  }

  setMessageSubject(message: string){
    this.messageSubject.next(message);
  }
}
