import {Component, OnInit, ViewChild} from '@angular/core';
import {TagService} from '../../core/services/tag.service';
import {MaterialModule} from '../../shared/material/material.module';
import {MatTableDataSource} from '@angular/material/table';
import {NgStyle} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {switchMap} from 'rxjs';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Tag} from '../../core/models/tag.model';
import {Page} from '../../core/models/pageable.model';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [MaterialModule, NgStyle, RouterOutlet, RouterLink],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent implements OnInit {

  //tags: TagModel[] = [];
  dataSource: MatTableDataSource<Tag>;
  displayedColumns: string[] = ['idTag', 'name', 'color', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currentPage: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  constructor(
    private tagService: TagService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.tagService.getTags(this.currentPage,this.pageSize).subscribe((data: Page<Tag>) => {
      this.createTable(data);
    });

    this.tagService.getTagsSubject().subscribe(data => {
      this.createTable(data);
    });

    this.tagService.getMessageSubject().subscribe((message: string) => {
      this._snackBar.open(message, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
    });
  }

  createTable(data: Page<Tag>): void {
    this.totalElements = data.totalElements
    this.dataSource = new MatTableDataSource(data.content);
    this.dataSource.sort = this.sort;
  }

  delete(idTag: number): void {
    this.tagService.deleteTag(idTag)
      .pipe(switchMap(() => this.tagService.getTags(this.currentPage, this.pageSize)))
      .subscribe(data => {
      this.tagService.setMessageSubject('DELETE SUCCESSFUL');
      this.tagService.setTagsSubject(data);
    });
  }

  applyFilter(event: Event) {
    this.dataSource.filter = event.target['value'].trim().toLowerCase();
  }

  showMore($event: PageEvent) {
    this.currentPage = $event.pageIndex;
    this.tagService.getTags($event.pageIndex, $event.pageSize).subscribe((data: Page<Tag>) => {
      this.totalElements = data.totalElements
      this.createTable(data);
    });

  }
}
