import {Injectable} from '@angular/core';
import {Permission} from '../models/permission.model';
import {PermissionService} from './permission.service';
import {Observable} from 'rxjs';
import {Resolve} from '@angular/router';

@Injectable({providedIn: 'root'})
export class PermissionResolver implements Resolve<Permission[]> {
  constructor(private permissionService: PermissionService) {
  }

  resolve(): Observable<Permission[]> {
    return this.permissionService.getPermissionsSubject();
  }
}
