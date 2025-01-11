import { Component } from '@angular/core';
import {MaterialModule} from '../../../shared/material/material.module';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [MaterialModule, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {



}
