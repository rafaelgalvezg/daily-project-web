import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TaskService} from '../../../core/services/task.service';
import {Task} from '../../../core/models/task.model';
import {switchMap} from 'rxjs';
import {MaterialModule} from '../../../shared/material/material.module';
import {NgForOf} from '@angular/common';
import {CollaboratorService} from '../../../core/services/collaborator.service';
import {Collaborator} from '../../../core/models/collaborator.model';
import {Project} from '../../../core/models/project.model';
import {ProjectService} from '../../../core/services/project.service';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink, NgForOf],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.css'
})
export class TaskEditComponent implements OnInit {

  formTask: FormGroup;
  project: Project;
  id: number;
  idProject: number;
  isEdit: boolean;
  collaborators: Collaborator[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private collaboratorService: CollaboratorService,
    private projectService: ProjectService
  ) {
  }

  ngOnInit(): void {
    this.formTask = new FormGroup({
      idTask: new FormControl(0, Validators.required),
      title: new FormControl('', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      priority: new FormControl('', Validators.required),
      assignedCollaborator: new FormControl('', Validators.required),
      version: new FormControl(0, Validators.required)
    });

    this.route.parent.params.subscribe(params => {
      this.idProject = params['idProject'];
    });

    this.collaboratorService.getCollaborators( ).subscribe(data => {
      this.collaborators = data.content;
    });

    this.projectService.getProject(this.idProject).subscribe(data => {
      this.project = data.project;
    });

    this.route.params.subscribe(params => {
      this.id = params['idTask'];
      this.formTask.get('idTask').disable();
      this.isEdit = !!params['idTask'];
      if (this.isEdit) this.initForm();
    });
  }

  operate() {
    if (this.formTask.invalid) {
      this.formTask.markAllAsTouched();
      return;
    }

    const task: Task = new Task();
    task.idTask = this.formTask.get('idTask').value;
    task.title = this.formTask.get('title').value;
    task.description = this.formTask.get('description').value;
    task.startDate = this.formTask.get('startDate').value;
    console.log(task.startDate);
    task.endDate = this.formTask.get('endDate').value;
    console.log(task.endDate);
    task.status = this.formTask.get('status').value;
    task.priority = this.formTask.get('priority').value;
    task.order = 0;
    task.project = this.project;
    task.assignedCollaborator = this.formTask.get('assignedCollaborator').value;
    task.version = this.formTask.get('version').value;

    if (this.isEdit) {
      this.taskService.updateTask(task).subscribe(() => {
        console.log('Task updated');
        this.taskService.getTasksByProject(this.idProject).subscribe(
          data => {
            this.taskService.setTasksSubject(data);
            this.taskService.setMessageSubject('UPDATED!');
          }
        );
      });
    } else {
      this.taskService.createTask(task)
        .pipe(switchMap(() => this.taskService.getTasksByProject(this.idProject)))
        .subscribe(data => {
          console.log('Task created');
          this.taskService.setTasksSubject(data);
          this.taskService.setMessageSubject('CREATED!');
        });
    }
    this.router.navigate(['features/projects/detail', this.idProject]).then(() => console.log('Navigated to project'));
  }

  private initForm() {
      this.taskService.getTask(this.id).subscribe(task => {
        this.formTask.get('idTask').setValue(task.idTask);
        this.formTask.get('title').setValue(task.title);
        this.formTask.get('description').setValue(task.description);
        this.formTask.get('startDate').setValue(task.startDate);
        this.formTask.get('endDate').setValue(task.endDate);
        this.formTask.get('status').setValue(task.status);
        this.formTask.get('priority').setValue(task.priority);
        this.formTask.get('assignedCollaborator').setValue(task.assignedCollaborator);
        this.formTask.get('version').setValue(task.version);
      });
  }

  get f() { return this.formTask.controls; }

}
