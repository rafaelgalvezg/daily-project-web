import {Role} from './role.model';

export class Permission {
  idPermission: number;
  name: string;
  url: string;
  action: string;
  icon: string;
  roles: Role[];
  version: number;
}
