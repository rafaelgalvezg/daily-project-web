import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Page} from '../models/pageable.model';
import {environment} from '../../../environments/environment.development';
import {Task} from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }
  private taskSubject: Subject<Page<Task>> = new Subject<Page<Task>>();
  private messageSubject: Subject<string> = new Subject<string>();


  private apiUrl = `${environment.apiBaseUrl}/api/v1/tasks`;

  getTasks(page: number = 0, size: number = 5, sort: string = 'startDate,asc'){
    return this.http.get<Page<Task>>(`${this.apiUrl}?page=${page}&size=${size}&sort=${sort}`);
  }

  getTask(id: number){
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  getTasksByProject(idProject: number, page: number = 0, size: number = 5, sort: string = 'startDate,asc'){
    return this.http.get<Page<Task>>(`${this.apiUrl}/project/${idProject}?page=${page}&size=${size}&sort=${sort}`);
  }

  createTask(task: Task){
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(task: Task){
    return this.http.put<Task>(`${this.apiUrl}/${task.idTask}`, task);
  }

  deleteTask(id: number){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getTasksSubject(){
    return this.taskSubject.asObservable();
  }

  setTasksSubject(tasks: Page<Task>){
    this.taskSubject.next(tasks);
  }

  getMessageSubject(){
    return this.messageSubject.asObservable()
  }

  setMessageSubject(message: string){
    this.messageSubject.next(message);
  }
}
