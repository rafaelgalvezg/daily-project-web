import {Component, OnInit} from '@angular/core';
import {MaterialModule} from '../../shared/material/material.module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  constructor(
  ) { }

  ngOnInit(): void {

  }

}
