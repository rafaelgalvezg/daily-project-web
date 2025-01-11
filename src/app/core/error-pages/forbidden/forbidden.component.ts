import { Component } from '@angular/core';
import {MaterialModule} from '../../../shared/material/material.module';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [MaterialModule, RouterLink],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.css'
})
export class ForbiddenComponent {

}
