import {Component, OnInit} from '@angular/core';
import {MaterialModule} from '../../material/material.module';
import {ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {Permission} from '../../../core/models/permission.model';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, NgIf, RouterLinkActive, NgOptimizedImage, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {

  permissions: Permission[];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.permissions = this.route.snapshot.data['permissions'];
  }

  logout() {
    this.authService.logout();
  }

}
