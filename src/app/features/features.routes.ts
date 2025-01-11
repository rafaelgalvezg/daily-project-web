import {Routes} from '@angular/router';
import {ProjectsComponent} from './projects/projects.component';
import {CollaboratorsComponent} from './collaborators/collaborators.component';
import {TagsComponent} from './tags/tags.component';
import {TagEditComponent} from './tags/tag-edit/tag-edit.component';
import {CollaboratorEditComponent} from './collaborators/collaborator-edit/collaborator-edit.component';
import {ProjectDetailComponent} from './projects/project-detail/project-detail.component';
import {TaskEditComponent} from './task/task-edit/task-edit.component';
import {ProjectNewComponent} from './projects/project-new/project-new.component';
import {DashboardComponent} from './dashboard/dashboard.component';

export const featuresRoutes: Routes = [
  {'path': 'dashboard', component: DashboardComponent},
  {
    path: 'projects', component: ProjectsComponent, children:
      [
        {path: 'new', component: ProjectNewComponent},
        {
          path: 'detail/:idProject', component: ProjectDetailComponent, children: [
            {path: 'task/:idTask/edit', component: TaskEditComponent},
            {path: 'task/new', component: TaskEditComponent}
          ]
        }
      ]
  },
  {
    path: 'tags', component: TagsComponent, children:
      [
        {path: 'new', component: TagEditComponent},
        {path: 'edit/:idTag', component: TagEditComponent}
      ]
  },
  {
    path: 'collaborators', component: CollaboratorsComponent, children:
      [
        {path: 'new', component: CollaboratorEditComponent},
        {path: 'edit/:idCollaborator', component: CollaboratorEditComponent}
      ]
  },
];
