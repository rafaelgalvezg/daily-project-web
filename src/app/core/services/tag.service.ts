import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';
import { Subject} from 'rxjs';
import {Page} from '../models/pageable.model';
import {Tag} from '../models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private http: HttpClient) { }
  private tagSubject: Subject<Page<Tag>> = new Subject<Page<Tag>>();
  private messageSubject: Subject<string> = new Subject<string>();

  private apiUrl = `${environment.apiBaseUrl}/api/v1/tags`;

  getTags(page: number = 0, size: number = 5, sort: string = 'idTag,desc'){
    return this.http.get<Page<Tag>>(`${this.apiUrl}?page=${page}&size=${size}&sort=${sort}`);
  }

  getTag(id: number){
    return this.http.get<Tag>(`${this.apiUrl}/${id}`);
  }

  createTag(tag: Tag){
    return this.http.post<Tag>(this.apiUrl, tag);
  }

  updateTag(tag: Tag){
    return this.http.put<Tag>(`${this.apiUrl}/${tag.idTag}`, tag);
  }

  deleteTag(id: number){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getTagsSubject(){
    return this.tagSubject.asObservable();
  }

  setTagsSubject(tags: Page<Tag>){
    this.tagSubject.next(tags);
  }

  getMessageSubject(){
    return this.messageSubject.asObservable()
  }

  setMessageSubject(message: string){
    this.messageSubject.next(message);
  }

}
