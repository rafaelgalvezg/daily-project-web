import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Page} from '../models/pageable.model';
import {environment} from '../../../environments/environment.development';
import {Permission} from '../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private http: HttpClient) { }
  private permissionsSubject = new BehaviorSubject<Permission[]>([]);
  private messageSubject: Subject<string> = new Subject<string>();

  private apiUrl = `${environment.apiBaseUrl}/permissions`;

  getPermissionsAll(){
    return this.http.get<Permission[]>(`${this.apiUrl}/all`);
  }

  getPermissions(page: number = 0, size: number = 5, sort: string = 'idPermission,desc'){
    return this.http.get<Page<Permission>>(`${this.apiUrl}?page=${page}&size=${size}&sort=${sort}`);
  }

  getPermission(id: number){
    return this.http.get<Permission>(`${this.apiUrl}/${id}`);
  }

  createPermission(permission: Permission){
    return this.http.post<Permission>(this.apiUrl, permission);
  }

  updatePermission(permission: Permission){
    return this.http.put<Permission>(`${this.apiUrl}/${permission.idPermission}`, permission);
  }

  deletePermission(id: number){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getPermissionsByUsername(username: string){
    return this.http.post<Permission[]>(`${this.apiUrl}/user`, username);
  }

  setPermissionsSubject(permissions: Permission[]): void {
    this.permissionsSubject.next(permissions);
  }

  getPermissionsSubject(): Observable<Permission[]> {
    return this.permissionsSubject.asObservable();
  }

  getMessageSubject(){
    return this.messageSubject.asObservable()
  }

  setMessageSubject(message: string){
    this.messageSubject.next(message);
  }
}
