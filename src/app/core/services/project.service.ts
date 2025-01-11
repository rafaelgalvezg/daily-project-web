import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Page} from '../models/pageable.model';
import {Project} from '../models/project.model';
import {environment} from '../../../environments/environment.development';
import {ProjectTeam} from '../models/projectTeam.model';
import {Member} from '../models/member.model';
import {FilterSearchProject} from '../models/filterSearchProject';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }
  private projectsSubject: Subject<Page<ProjectTeam>> = new Subject<Page<ProjectTeam>>();
  private projectSubject: Subject<ProjectTeam> = new Subject<ProjectTeam>();
  private messageSubject: Subject<string> = new Subject<string>();

  private apiUrl = `${environment.apiBaseUrl}/api/v1/projects`;

  getProjects(page: number = 0, size: number = 5, sort: string = 'idProject,desc'){
    return this.http.get<Page<ProjectTeam>>(`${this.apiUrl}?page=${page}&size=${size}&sort=${sort}`);
  }

  getProject(id: number){
    return this.http.get<ProjectTeam>(`${this.apiUrl}/${id}`);
  }

  createProject(projectTeam: ProjectTeam){
    return this.http.post<ProjectTeam>(this.apiUrl, projectTeam);
  }

  updateProject(project: Project){
    return this.http.put<ProjectTeam>(`${this.apiUrl}/${project.idProject}`, project);
  }
  updateProjectMembers(id: number, members: Member[]){
    return this.http.put<ProjectTeam>(`${this.apiUrl}/${id}/members`, members);
  }
  deleteProject(id: number){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


  searchProjects(
    filterSearchProject: FilterSearchProject,
    page: number = 0,
    size: number = 5
  ): Observable<Page<ProjectTeam>> {
    return this.http.post<Page<ProjectTeam>>(`${this.apiUrl}/search?page=${page}&size=${size}`, filterSearchProject);
  }

  getProjectsSubject(){
    return this.projectsSubject.asObservable();
  }

  setProjectsSubject(projects: Page<ProjectTeam>){
    this.projectsSubject.next(projects);
  }

  getProjectSubject(){
    return this.projectSubject.asObservable();
  }

  setProjectSubject(project: ProjectTeam){
    this.projectSubject.next(project);
  }

  getMessageSubject(){
    return this.messageSubject.asObservable()
  }

  setMessageSubject(message: string){
    this.messageSubject.next(message);
  }


}
