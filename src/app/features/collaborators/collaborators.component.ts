import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MaterialModule} from '../../shared/material/material.module';
import {Collaborator} from '../../core/models/collaborator.model';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {CollaboratorService} from '../../core/services/collaborator.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {switchMap} from 'rxjs';
import {RouterLink, RouterOutlet} from '@angular/router';
import {Page} from '../../core/models/pageable.model';

@Component({
  selector: 'app-collaborators',
  standalone: true,
  imports: [MaterialModule, RouterLink, RouterOutlet],
  templateUrl: './collaborators.component.html',
  styleUrl: './collaborators.component.css'
})
export class CollaboratorsComponent implements OnInit {


  //collaborators: CollaboratorModel[] = [];
  dataSource: MatTableDataSource<Collaborator>;
  displayedColumns: string[] = ['idCollaborator', 'name', 'email', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currentPage: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  constructor(
    private collaboratorService: CollaboratorService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.collaboratorService.getCollaborators(this.currentPage,this.pageSize).subscribe((data: Page<Collaborator>) => {
      this.createTable(data);
    });

    this.collaboratorService.getCollaboratorsSubject().subscribe(data => {
      this.createTable(data);
    });

    this.collaboratorService.getMessageSubject().subscribe((message: string) => {
      this._snackBar.open(message, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
    });
  }

  createTable(data: Page<Collaborator>): void {
    this.totalElements = data.totalElements
    this.dataSource = new MatTableDataSource(data.content);
    this.dataSource.sort = this.sort;
  }

  delete(idCollaborator: number): void {
    this.collaboratorService.deleteCollaborator(idCollaborator)
      .pipe(switchMap(() => this.collaboratorService.getCollaborators(this.currentPage, this.pageSize)))
      .subscribe(data => {
        this.collaboratorService.setMessageSubject('DELETE SUCCESSFUL');
        this.collaboratorService.setCollaboratorsSubject(data);
      });
  }

  applyFilter(event: Event) {
    this.dataSource.filter = event.target['value'].trim().toLowerCase();
  }

  showMore($event: PageEvent) {
    this.currentPage = $event.pageIndex;
    this.collaboratorService.getCollaborators($event.pageIndex, $event.pageSize).subscribe((data: Page<Collaborator>) => {
      this.totalElements = data.totalElements
      this.createTable(data);
    });

  }
}



