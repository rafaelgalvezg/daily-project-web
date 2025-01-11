import {Component, Inject, OnInit} from '@angular/core';
import {MemberRole} from '../../../core/models/memberRole.enum';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MaterialModule} from '../../../shared/material/material.module';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-member-dialog',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './member-dialog.component.html',
  styleUrl: './member-dialog.component.css'
})
export class MemberDialogComponent implements OnInit {

  memberForm: FormGroup;
  roles = Object.keys(MemberRole);
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.isEdit = !!this.data.member;
    this.memberForm = this.fb.nonNullable.group({
      collaborator: [{ value: this.data.member?.collaborator || '', disabled: this.isEdit }, Validators.required],
      role: [this.data.member?.role || '', Validators.required]
    });
  }

  save(): void {
    if (this.memberForm.valid) {
      const result = {
        member: this.memberForm.get('collaborator')?.value,
        role: this.memberForm.get('role')?.value
      };
      this.dialogRef.close(result);
    }
  }

}
