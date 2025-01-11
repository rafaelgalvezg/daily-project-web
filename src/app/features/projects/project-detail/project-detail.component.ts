import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../../core/services/project.service';
import {MaterialModule} from '../../../shared/material/material.module';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {TaskComponent} from '../../task/task.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CollaboratorService} from '../../../core/services/collaborator.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Collaborator} from '../../../core/models/collaborator.model';
import {ProjectTeam} from '../../../core/models/projectTeam.model';
import {Member} from '../../../core/models/member.model';
import {switchMap} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ProjectDialogService} from '../../../core/services/project-dialog.service';
import {ProjectEditDialogComponent} from '../project-edit-dialog/project-edit-dialog.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    MaterialModule,
    NgClass,
    TaskComponent,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit {

  idProject: number;
  project: ProjectTeam;
  availableCollaborators: Collaborator[];

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private collaboratorService: CollaboratorService,
    private _snackBar: MatSnackBar,
    private dialogService: ProjectDialogService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idProject = params['idProject'];
      this.loadProject();
    });

    this.collaboratorService.getCollaborators().subscribe(data => {
      this.availableCollaborators = data.content;
    });

    this.projectService.getMessageSubject().subscribe((message: string) => {
      this._snackBar.open(message, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
    });

    this.projectService.getProjectSubject().subscribe(data => {
      this.project = data;
    });

  }

  private loadProject() {
    this.projectService.getProject(this.idProject).subscribe((response: ProjectTeam) => {
      this.project = response;
    });

  }

  private updateProjectMembers(idProject: number, members: Member[]): void {
    this.projectService.updateProjectMembers(idProject, members)
      .pipe(switchMap(() => this.projectService.getProject(this.idProject)))
      .subscribe(response => {
        this.projectService.setProjectSubject(response);
      });
  }

  removeMember(project: ProjectTeam, member: Member): void {
    const updatedMembers = project.members.filter((m: Member) => m !== member);
    this.updateProjectMembers(project.project.idProject, updatedMembers);
    this.projectService.setMessageSubject('Members removed successfully');
  }

  openAddMember(project: ProjectTeam): void {
    this.dialogService.openAddMemberDialog(project, this.availableCollaborators).subscribe((result) => {
      if (result) {
        const newMember: Member = {
          member: result.member,
          role: result.role,
        };
        project.members.push(newMember);
        this.updateProjectMembers(project.project.idProject, project.members);
        this.projectService.setMessageSubject('Member added successfully');
      }
    });
  }

  openEditMember(project: ProjectTeam, member: Member): void {
    this.dialogService.openEditMemberDialog(project, member).subscribe((result) => {
      if (result) {
        member.role = result.role;
        this.updateProjectMembers(project.project.idProject, project.members);
        this.projectService.setMessageSubject('Role updated successfully');
      }
    });
  }

  deleteProject(project: ProjectTeam): void {
    this.projectService.deleteProject(project.project.idProject).subscribe(
      {
        next: () =>
          this.router.navigate(['features/projects']).then(() => {
              this.projectService.setMessageSubject('Project deleted successfully');
            }
          ),
        error: (err) => {
          this.projectService.setMessageSubject('Error deleting project');
          console.error('Error deleting project:', err);
        },
      })
  }

  openEditDialog(projectEdit: ProjectTeam): void {
    const dialogRef = this.dialog.open(ProjectEditDialogComponent, {
      width: '400px',
      data: {project: {...projectEdit.project}}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        Object.assign(projectEdit.project, result);

        this.projectService.updateProject(projectEdit.project).subscribe({
          next: (updatedProject) => {
            this.projectService.setProjectSubject(updatedProject);
            this.projectService.setMessageSubject('Project updated successfully');
            console.log('Updated Project:', updatedProject);
          },
          error: (err) => {
            console.error('Error updating project:', err);
          },
          complete: () => {
            console.log('Update project request completed.');
          }
        });
      }
    });
  }


}
