import {Component, OnInit} from '@angular/core';
import {MaterialModule} from '../../../shared/material/material.module';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TagService} from '../../../core/services/tag.service';
import {Tag} from '../../../core/models/tag.model';
import {switchMap} from 'rxjs';

@Component({
  selector: 'app-tag-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './tag-edit.component.html',
  styleUrl: './tag-edit.component.css'
})
export class TagEditComponent implements OnInit {
  form: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tagService: TagService
  ) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      idTag: new FormControl(0, Validators.required),
      name: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]),
      color: new FormControl('', [Validators.required, Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)]),
      version: new FormControl(0, Validators.required)
    });

    this.route.params.subscribe(params => {
      this.id = params['idTag'];
      this.form.get('idTag').disable();
      this.isEdit = !!params['idTag'];
      if (this.isEdit) this.initForm();
    });

  }

  operate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
   const tag: Tag = new Tag();
    tag.idTag = this.form.get('idTag').value;
    tag.name = this.form.get('name').value;
    tag.color = this.form.get('color').value;
    tag.version = this.form.get('version').value;

    if (this.isEdit) {
      this.tagService.updateTag(tag).subscribe(() => {
        console.log('Tag updated');
        this.tagService.getTags().subscribe(
          data => {
            this.tagService.setTagsSubject(data);
            this.tagService.setMessageSubject('UPDATED!');
          }
        );
      });
    } else {
      this.tagService.createTag(tag)
        .pipe(switchMap(() => this.tagService.getTags()))
        .subscribe(data => {
          console.log('Tag created');
          this.tagService.setTagsSubject(data);
          this.tagService.setMessageSubject('CREATED!');
      });
    }
    this.router.navigate(['features/tags']).then(() => console.log('Navigated to tags'));
  }

  private initForm() {
  this.tagService.getTag(this.id).subscribe(tag => {
    this.form.get('idTag').setValue(tag.idTag);
    this.form.get('name').setValue(tag.name);
    this.form.get('color').setValue(tag.color);
    this.form.get('version').setValue(tag.version);
  });
  }

  get f() { return this.form.controls; }
}
