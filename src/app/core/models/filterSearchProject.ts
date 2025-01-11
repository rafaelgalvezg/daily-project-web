import {Status} from './status.enum';

export class FilterSearchProject {
  constructor(
    public name?: string,
    public description?: string,
    public startDate?: string,
    public endDate?: string,
    public status?: Status
  ) {
  }
}
