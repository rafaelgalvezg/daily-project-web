import {Status} from './status.enum';
import {Project} from './project.model';
import {Collaborator} from './collaborator.model';
import {Tag} from './tag.model';
import {Priority} from './priority.enum';

export class Task {
  idTask: number
  title: string
  description: string
  startDate: string
  endDate: string
  status: Status
  priority: Priority
  order: number
  assignedCollaborator: Collaborator
  project: Project
  tags: Tag[]
  version: number
}
