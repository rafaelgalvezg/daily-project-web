import {Collaborator} from './collaborator.model';
import {MemberRole} from './memberRole.enum';

export class Member {
  member: Collaborator;
  role: MemberRole;
}
