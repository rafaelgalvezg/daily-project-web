import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ProjectTeam} from '../models/projectTeam.model';
import {Observable} from 'rxjs';
import {MemberDialogComponent} from '../../features/projects/member-dialog/member-dialog.component';
import {Member} from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectDialogService {

  constructor(private dialog: MatDialog) {}

  openAddMemberDialog(project: ProjectTeam, collaborators: any[]): Observable<any> {
    const dialogRef = this.dialog.open(MemberDialogComponent, {
      width: '400px',
      data: {
        project,
        collaborators,
      },
    });

    return dialogRef.afterClosed();
  }

  openEditMemberDialog(project: ProjectTeam, member: Member): Observable<any> {
    const dialogRef = this.dialog.open(MemberDialogComponent, {
      width: '400px',
      data: {
        project,
        member,
      },
    });

    return dialogRef.afterClosed();
  }
}
