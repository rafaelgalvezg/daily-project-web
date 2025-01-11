import {Component, Inject, OnInit} from '@angular/core';
import {MaterialModule} from '../../../shared/material/material.module';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForOf, NgIf} from '@angular/common';
import {Status} from '../../../core/models/status.enum';

@Component({
  selector: 'app-project-edit-dialog',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, NgIf, FormsModule, NgForOf],
  templateUrl: './project-edit-dialog.component.html',
  styleUrl: './project-edit-dialog.component.css'
})
export class ProjectEditDialogComponent implements OnInit {
  projectForm!: FormGroup;
  statuses = Object.keys(Status);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProjectEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group(
      {
        name: [this.data.project.name, [Validators.required, Validators.maxLength(50)]],
        description: [this.data.project.description, [Validators.required, Validators.maxLength(200)]],
        status: [this.data.project.status, Validators.required],
        startDate: [this.data.project.startDate, Validators.required],
        endDate: [this.data.project.endDate]
      },
      { validators: this.dateRangeValidator }
    );
  }

  dateRangeValidator(group: AbstractControl) {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;
    return endDate && startDate && endDate < startDate
      ? { dateRange: true }
      : null;
  }

  saveChanges(): void {
    if (this.projectForm.valid) {
      this.dialogRef.close(this.projectForm.value);
    }
  }


}
