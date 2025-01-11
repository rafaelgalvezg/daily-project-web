import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {PermissionService} from '../services/permission.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {environment} from '../../../environments/environment.development';
import {map} from 'rxjs';

export const certGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

 const loginService = inject(AuthService);
 const permissionService = inject(PermissionService);
 const router = inject(Router)

  // verify if the user has a valid login session
  if (!loginService.isAuthenticated()) {
    loginService.logout();
    return false;
  }
  // verify if the token is valid
  const helper = new JwtHelperService();
  const token = sessionStorage.getItem(environment.TOKEN_NAME);
  if (!helper.isTokenExpired(token)) {
    // verify if the role user has access to the route
    const url = state.url;
    const decodedToken = helper.decodeToken(token);
    const username = decodedToken.sub;

    return permissionService.getPermissionsByUsername(username).pipe(
      map(permissions => {
        const hasPermission = permissions.some(permission => url.startsWith(permission.url));
        if (hasPermission) {
          permissionService.setPermissionsSubject(permissions);
          return true;
        } else {
          router.navigate(['/forbidden']).then();
          return false;
        }
      })
    )
  }else {
    loginService.logout();
    return false;
  }
}
