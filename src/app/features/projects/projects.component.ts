import {Component, OnInit} from '@angular/core';
import {MaterialModule} from '../../shared/material/material.module';
import {ProjectService} from '../../core/services/project.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {Member} from '../../core/models/member.model';
import {switchMap} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProjectTeam} from '../../core/models/projectTeam.model';
import {CollaboratorService} from '../../core/services/collaborator.service';
import {Collaborator} from '../../core/models/collaborator.model';
import {ProjectDialogService} from '../../core/services/project-dialog.service';
import {ProjectEditDialogComponent} from './project-edit-dialog/project-edit-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Status} from '../../core/models/status.enum';
import moment from 'moment';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [MaterialModule, NgForOf, NgClass, RouterLink, RouterOutlet, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  currentPage = 0;
  pageSize = 5;
  availableCollaborators: Collaborator[];
  formSearch: FormGroup;
  statuses = Object.keys(Status);

  constructor(
    private projectService: ProjectService,
    private collaboratorService: CollaboratorService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialogService: ProjectDialogService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.loadProjects();

    this.projectService.getProjectsSubject().subscribe((projects: any) => {
      this.projects = projects.content.map((item: any) => ({
        ...item,
        tasks: null
      }));
    });

    this.collaboratorService.getCollaborators().subscribe(data => {
      this.availableCollaborators = data.content;
    });

    this.projectService.getMessageSubject().subscribe((message: string) => {
      this._snackBar.open(message, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
    });
    this.initFormSearch();
  }

  private initFormSearch(): void {
    this.formSearch = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      status: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
    })
  }

  private loadProjects(): void {
    this.projectService.getProjects(this.currentPage, this.pageSize).subscribe((response: any) => {
      const newProjects = response.content.map((item: any) => ({
        ...item,
        tasks: null
      }));
      this.projects.push(...newProjects);
    });  }

  loadMore(): void {
    this.currentPage++;
    this.loadProjects();
  }

  redirectToDetails(id: number): void {
    this.router.navigate(['/features/projects/detail', id]).then();
  }

  private updateProjectMembers(idProject: number, members: Member[]): void {
    this.projectService.updateProjectMembers(idProject, members)
      .pipe(switchMap(() => this.projectService.getProjects(this.currentPage, this.pageSize)))
      .subscribe(response => {
        this.projectService.setProjectsSubject(response);
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
    this.projectService.deleteProject(project.project.idProject)
      .pipe(switchMap(() => this.projectService.getProjects(this.currentPage, this.pageSize)))
      .subscribe(response => {
        this.projectService.setProjectsSubject(response);
      });
    this.projectService.setMessageSubject('Project deleted successfully');
  }

  openEditDialog(projectEdit: ProjectTeam): void {
    const dialogRef = this.dialog.open(ProjectEditDialogComponent, {
      width: '400px',
      data: { project: { ...projectEdit.project } }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        Object.assign(projectEdit.project, result);

        this.projectService.updateProject(projectEdit.project)
          .pipe(switchMap(() => this.projectService.getProjects(this.currentPage, this.pageSize)))
          .subscribe(response => {
            this.projectService.setProjectsSubject(response);
          });
        this.projectService.setMessageSubject('Project updated successfully');
      }
    });
  }

  search() {
    const name: string = this.formSearch.value['name']?.toLowerCase() || null;
    const description: string = this.formSearch.value['description']?.toLowerCase() || null;
    const status: Status = this.formSearch.value['status'] || null;
    const startDate: string = this.formSearch.value['startDate']
      ? moment(this.formSearch.value['startDate']).format('YYYY-MM-DD')
      : null;
    const endDate: string = this.formSearch.value['endDate']
      ? moment(this.formSearch.value['endDate']).format('YYYY-MM-DD')
      : null;

    const filterSearchProject = {name, description, startDate, endDate, status };

    this.projectService.searchProjects(filterSearchProject).subscribe({
      next: (data) => {
        this.projects = data.content;
      },
      error: (err) => console.error('Error searching projects:', err),
    });
  }

  checkChildren(): boolean {
    return this.route.children.length > 0;
  }

  clearForm() {
    this.initFormSearch();
    this.projects = [];
    this.loadProjects();
  }
}
