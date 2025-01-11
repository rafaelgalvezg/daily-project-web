import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TagsComponent} from './features/tags/tags.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TagsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'daily-project-web';
}
