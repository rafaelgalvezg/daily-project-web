import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ChangeTracking} from '../../../core/models/changeTracking.model';
import {MaterialModule} from '../../../shared/material/material.module';
import {DatePipe} from '@angular/common';
import {ChangeTrackingService} from '../../../core/services/change-tracking.service';

@Component({
  selector: 'app-change-tracking-dialog',
  standalone: true,
  imports: [MaterialModule, DatePipe],
  templateUrl: './change-tracking-dialog.component.html',
  styleUrl: './change-tracking-dialog.component.css'
})
export class ChangeTrackingDialogComponent implements OnInit {
  changeTracking: ChangeTracking[] = [];

  constructor(
    private dialogRef: MatDialogRef<ChangeTrackingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      taskId: number
    },
    private changeTrackingService: ChangeTrackingService) {
  }

  ngOnInit(): void {
    this.loadChangeTracking();
  }

  loadChangeTracking(): void {
    this.changeTrackingService.getTrackingByTask(this.data.taskId).subscribe(response => {
      this.changeTracking = response;
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
