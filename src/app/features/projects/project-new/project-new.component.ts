import {Component, OnInit} from '@angular/core';
import {MaterialModule} from '../../../shared/material/material.module';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Status} from '../../../core/models/status.enum';
import {ProjectService} from '../../../core/services/project.service';
import {CollaboratorService} from '../../../core/services/collaborator.service';
import {MatDialog} from '@angular/material/dialog';
import {Router, RouterLink} from '@angular/router';
import {Collaborator} from '../../../core/models/collaborator.model';
import {MemberDialogComponent} from '../member-dialog/member-dialog.component';
import {ProjectTeam} from '../../../core/models/projectTeam.model';
import {NgForOf, NgIf} from '@angular/common';
import {switchMap} from 'rxjs';

@Component({
  selector: 'app-project-new',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './project-new.component.html',
  styleUrl: './project-new.component.css'
})
export class ProjectNewComponent implements OnInit {
  projectForm: FormGroup;
  members: any[] = [];
  collaborators: Collaborator[] = [];
  statuses = Object.keys(Status);

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private collaboratorService: CollaboratorService,
    private dialog: MatDialog,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      idProject: [0, Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: [Status.PLANNING, Validators.required],
      version: [0, Validators.required],
    });

    this.collaboratorService.getCollaborators().subscribe({
      next: (data) => {
        this.collaborators = data.content;
      },
      error: (err) => console.error('Error al cargar colaboradores:', err),
    });
  }

  addMember(): void {
    const dialogRef = this.dialog.open(MemberDialogComponent, {
      width: '400px',
      data: {collaborators: this.collaborators}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.members.push(result);

        if (this.projectForm.hasError('noMembers')) {
          this.projectForm.setErrors(null);
        }
      }
    });
  }

  removeMember(index: number): void {
    this.members.splice(index, 1);

    if (this.members.length === 0) {
      this.projectForm.setErrors({ noMembers: true });
    } else {
      this.projectForm.setErrors(null);
    }
  }

  saveProject(): void {
    if (this.projectForm.invalid) {
      return;
    }
    console.log(this.projectForm.value);
    if (this.members.length === 0) {
      this.projectForm.setErrors({noMembers: true});
      return;
    }

    const projectData: ProjectTeam = {
      project: this.projectForm.value,
      members: this.members.map((member) => ({
        member: member.member,
        role: member.role,
      })),
    };

    this.projectService.createProject(projectData)
      .pipe(switchMap(() => this.projectService.getProjects(0, 5)))
      .subscribe({
      next: data => {
        this.projectService.setProjectsSubject(data);
        this.router.navigate(['/features/projects']).then(() => {
            this.projectService.setMessageSubject('Project created successfully');
          }
        );
      },
      error: (err) => {
        this.projectService.setMessageSubject('Error creating project');
        console.error('Error creating project:', err);
      }
    });
  }
}
