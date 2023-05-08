import {Injectable} from '@angular/core';
import {from, Observable, of} from 'rxjs';
import {KeycloakService} from 'keycloak-angular';
import {distinctUntilChanged, shareReplay, switchMap} from 'rxjs/operators';
import {KeycloakProfile} from 'keycloak-js';

@Injectable()
export class KeycloakUserService {
  userProfile$;

  constructor(private keycloakService: KeycloakService) {
    this.userProfile$ = from(this.keycloakService.isLoggedIn()).pipe(
      distinctUntilChanged(),
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return this.keycloakService.loadUserProfile();
        }
        return of(null);
      }),
      shareReplay());
  }

  getUserProfile(): Observable<KeycloakProfile> {
    return this.userProfile$;
  }

}


