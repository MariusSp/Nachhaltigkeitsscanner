import {Component, OnInit} from '@angular/core';
import {Route, Router} from '@angular/router';
import {KeycloakService} from 'keycloak-angular';
import {from, Observable, of, Subject} from 'rxjs';
import {map, shareReplay, startWith, switchMap} from 'rxjs/operators';
import {ROUTES} from '../routing';
import {KeycloakUserService} from '../../service/keycloak.service';
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-app-wrapper',
  templateUrl: './app-wrapper.component.html',
  styleUrls: ['./app-wrapper.component.scss'],
})
export class AppWrapperComponent implements OnInit {
  static newCompany = new Subject();
  isLoggedIn$: Observable<boolean> = from(
    this.keycloakService.isLoggedIn()
  ).pipe(shareReplay());
  loggedInCompanyName$ = this.isLoggedIn$.pipe(switchMap((loggedIn) => loggedIn ?
    AppWrapperComponent.newCompany.pipe(startWith(null),
      switchMap(() => this.dataService.getCompanyByUserId(this.keycloakService.getKeycloakInstance().subject)),
      switchMap(company => company != null ? of(company.name) :
        this.keycloakUserService.getUserProfile().pipe(map(profile => profile.lastName))))
    : of(null)));

  firstLetterOfUser$: Observable<string> = this.isLoggedIn$.pipe(
    switchMap(() =>
      this.keycloakUserService.getUserProfile()
    ),
    map((userProfile) => (userProfile ? userProfile.username.substr(0, 1).toUpperCase() : null))
  );

  constructor(
    private router: Router,
    private keycloakService: KeycloakService,
    private keycloakUserService: KeycloakUserService,
    private dataService: DataService
  ) {
  }

  ngOnInit(): void {
  }

  getRoutes(): Route[] {
    const base = ROUTES.find((route: Route) => route?.path === '');
    return base.children.filter(
      (child: Route) =>
        child?.data?.name != null &&
        child?.data?.name !== '' &&
        child?.data?.name !== '**'
    );
  }

  isActive(route: string): boolean {
    return (
      this.router.url.includes('/' + route + '/') ||
      this.router.url.endsWith('/' + route)
    );
  }

  isAllowed(route: Route): boolean {
    if (route.data?.roles == null || route.data?.roles.length === 0) {
      return true;
    }
    for (const role of route.data.roles) {
      if (this.keycloakService.isUserInRole(role)) {
        return true;
      }
    }
    return false;
  }

  login(): void {
    this.keycloakService.login();
  }

  logout(): void {
    this.keycloakService.logout(new URL(window.location.href).origin);
  }

}
