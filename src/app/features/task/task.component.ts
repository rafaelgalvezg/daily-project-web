import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';

import {Task} from '../../core/models/task.model';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {TaskService} from '../../core/services/task.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Page} from '../../core/models/pageable.model';
import {switchMap} from 'rxjs';
import {MaterialModule} from '../../shared/material/material.module';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, RouterLink, RouterOutlet} from '@angular/router';
import {NgClass} from '@angular/common';
import {ChangeTrackingService} from '../../core/services/change-tracking.service';
import {ChangeTracking} from '../../core/models/changeTracking.model';
import {ChangeTrackingDialogComponent} from './change-tracking-dialog/change-tracking-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink, NgClass],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit{

  @Input() idProject: number;

  dataSource: MatTableDataSource<Task>;
  displayedColumns: string[] = ['idTask', 'title', 'description', 'startDate', 'endDate', 'status', 'priority', 'assignedCollaborator', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currentPage: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;


  constructor(
    private taskService: TaskService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private changeTrackingService: ChangeTrackingService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.taskService.getTasksByProject(this.idProject, this.currentPage,this.pageSize).subscribe((data: Page<Task>) => {
      this.createTable(data);
    });

    this.taskService.getTasksSubject().subscribe(data => {
      this.createTable(data);
    });

    this.taskService.getMessageSubject().subscribe((message: string) => {
      this._snackBar.open(message, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
    });
  }

  createTable(data: Page<Task>): void {
    this.totalElements = data.totalElements
    this.dataSource = new MatTableDataSource(data.content);
    this.dataSource.sort = this.sort;
  }

  delete(idTask: number): void {
    this.taskService.deleteTask(idTask)
      .pipe(switchMap(() => this.taskService.getTasksByProject(this.idProject, this.currentPage, this.pageSize)))
      .subscribe(data => {
        this.taskService.setMessageSubject('DELETE SUCCESSFUL');
        this.taskService.setTasksSubject(data);
      });
  }

  applyFilter(event: Event) {
    this.dataSource.filter = event.target['value'].trim().toLowerCase();
  }

  showMore($event: PageEvent) {
    this.currentPage = $event.pageIndex;
    this.taskService.getTasksByProject(this.idProject, $event.pageIndex, $event.pageSize).subscribe((data: Page<Task>) => {
      this.totalElements = data.totalElements
      this.createTable(data);
    });

  }

  openChangeTrackingDialog(taskId: number): void {
    this.dialog.open(ChangeTrackingDialogComponent, {width: '800px', data: {taskId: taskId}});
  }

  checkChildren(): boolean {
    return this.route.children.length > 0;
  }
}
