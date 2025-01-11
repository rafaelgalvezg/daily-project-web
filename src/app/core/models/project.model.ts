import {Status} from './status.enum';

export class Project {
  idProject: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: Status;
  version: number;
}
