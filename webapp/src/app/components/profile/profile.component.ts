import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Company, DataService, Report} from 'src/app/service/data.service';
import {filter, map, shareReplay, startWith, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {from, Observable, ReplaySubject, Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {KeycloakUserService} from '../../service/keycloak.service';
import {KeycloakService} from 'keycloak-angular';
import {FormControl, FormGroup} from '@angular/forms';
import {AppWrapperComponent} from "../app-wrapper/app-wrapper.component";

@Component({
  selector: 'app-profile', templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {
  userid$: string = this.keycloakService.getKeycloakInstance().subject;
  company$: ReplaySubject<Company> = new ReplaySubject(1);
  availableCompanies$: Observable<Company[]>;
  reports$: Observable<Report[]>;
  filter: FormGroup;
  destroyed$ = new Subject();

  isCorrectLoggedIn$: Observable<boolean> = from(
    this.company$.pipe(map((company) => this.keycloakService.getKeycloakInstance().subject === company?.userId && company?.userId != null)))
    .pipe(shareReplay());

  constructor(private keycloakUserService: KeycloakUserService, private keycloakService: KeycloakService,
              private dataService: DataService, private route: ActivatedRoute, private ref: ChangeDetectorRef, private router: Router) {
  }


  ngOnInit(): void {
    this.route.params.pipe(take(1), filter(params => Number(params.companyID) === -1),
      switchMap(() => this.keycloakUserService.getUserProfile()), take(1), filter(v => v == null))
      .subscribe(() => this.router.navigate(['/welcome']));
    this.filter = new FormGroup({companyName: new FormControl()});

    // Load UserProfile
    this.route.params.pipe(takeUntil(this.destroyed$), switchMap(
      params => params.companyID !== '-1' ? this.dataService.getCompanyByID(params.companyID) :
        this.dataService.getCompanyByUserId(this.keycloakService.getKeycloakInstance().subject)))
      .subscribe((company: Company) => this.company$.next(company));

    this.availableCompanies$ = this.company$.pipe(filter(company => company == null),
      switchMap(() => this.dataService.getAvailableCompanies()), shareReplay(1), switchMap(
        companies => this.filter.valueChanges.pipe(startWith({companyName: ''}),
          map((value) => companies.filter(c => c.name.toLowerCase().includes(value.companyName.toLowerCase()))))),
      tap(() => this.ref.detectChanges()));

    this.reports$ = this.company$.pipe(
      switchMap((company: Company) => this.dataService.getReportsForCompany(company.id.toString())),
      shareReplay(1));
  }

  assignCompany(company: Company): void {
    this.dataService.assingUserToCompany(company, this.keycloakService.getKeycloakInstance().subject).pipe(take(1),
      tap(() => AppWrapperComponent.newCompany.next()))
      .subscribe((assignedCompany: Company) => this.company$.next(assignedCompany));
  }

  createAndAssignCompany(companyName: string): void {
    this.dataService.insertCompany(companyName).subscribe((company: Company) => this.assignCompany(company));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
