import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MaterialModule} from '../../../shared/material/material.module';
import {switchMap} from 'rxjs';
import {CollaboratorService} from '../../../core/services/collaborator.service';
import {Collaborator} from '../../../core/models/collaborator.model';

@Component({
  selector: 'app-collaborator-edit',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './collaborator-edit.component.html',
  styleUrl: './collaborator-edit.component.css'
})
export class CollaboratorEditComponent implements OnInit {

  formCollaborator: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collaboratorService: CollaboratorService
  ) {
  }

  ngOnInit(): void {
    this.formCollaborator = new FormGroup({
      idCollaborator: new FormControl(0, Validators.required),
      name: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      version: new FormControl(0, Validators.required)
    });

    this.route.params.subscribe(params => {
      this.id = params['idCollaborator'];
      this.formCollaborator.get('idCollaborator').disable();
      this.isEdit = !!params['idCollaborator'];
      if (this.isEdit) this.initForm();
    });

  }

  operate() {
    if (this.formCollaborator.invalid) {
      this.formCollaborator.markAllAsTouched();
      return;
    }
    const collaborator: Collaborator = new Collaborator();
    collaborator.idCollaborator = this.formCollaborator.get('idCollaborator').value;
    collaborator.name = this.formCollaborator.get('name').value;
    collaborator.email = this.formCollaborator.get('email').value;
    collaborator.version = this.formCollaborator.get('version').value;

    if (this.isEdit) {
      this.collaboratorService.updateCollaborator(collaborator).subscribe(() => {
        console.log('Collaborator updated');
        this.collaboratorService.getCollaborators().subscribe(
          data => {
            this.collaboratorService.setCollaboratorsSubject(data);
            this.collaboratorService.setMessageSubject('UPDATED!');
          }
        );
      });
    } else {
      this.collaboratorService.createCollaborator(collaborator)
        .pipe(switchMap(() => this.collaboratorService.getCollaborators()))
        .subscribe(data => {
          console.log('Collaborator created');
          this.collaboratorService.setCollaboratorsSubject(data);
          this.collaboratorService.setMessageSubject('CREATED!');
        });
    }
    this.router.navigate(['features/collaborators']).then(() => console.log('Navigated to collaborators'));
  }

  private initForm() {
    this.collaboratorService.getCollaborator(this.id).subscribe(collaborator => {
      this.formCollaborator.get('idCollaborator').setValue(collaborator.idCollaborator);
      this.formCollaborator.get('name').setValue(collaborator.name);
      this.formCollaborator.get('email').setValue(collaborator.email);
      this.formCollaborator.get('version').setValue(collaborator.version);
    });
  }

  get f() { return this.formCollaborator.controls; }

}
