import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {Company, DataService, Report} from '../../service/data.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {KeycloakUserService} from '../../service/keycloak.service';
import {KeycloakService} from 'keycloak-angular';
import {ActivatedRoute, Router} from '@angular/router';
import {map, shareReplay, switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-company-edit-report',
  templateUrl: './company-edit-report.component.html',
  styleUrls: ['./company-edit-report.component.scss']
})
export class CompanyEditReportComponent implements OnInit, OnDestroy {
  report$: Observable<Report>;
  company$: ReplaySubject<Company> = new ReplaySubject(1);
  inputForm: FormGroup;
  destroyed$ = new Subject();

  constructor(private keycloakUserService: KeycloakUserService, private keycloakService: KeycloakService,
              private dataService: DataService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.dataService.getCompanyByUserId(this.keycloakService.getKeycloakInstance().subject)
      .subscribe((company: Company) => {
        this.company$.next(company);
      });
    this.report$ = this.route.params.pipe(takeUntil(this.destroyed$), switchMap(params => this.company$.pipe(
      switchMap(company => this.dataService.getReportByYearByCompany(company.id, params.year)))), shareReplay(1));

    this.report$.pipe(takeUntil(this.destroyed$), map(rl => {
      const report = rl[0];
      Object.keys(report)
        .forEach(key => report[key] = new FormControl(report[key], []));
      return report;
    }))
      .subscribe((report) => {
        this.inputForm = new FormGroup(report);
      });
  }

  onSubmitEdit(): void {
    this.dataService.editCompanyReport(this.inputForm.value as Report).subscribe(() => this.router.navigate(['/profile/-1']));
  }

  onSubmitDelete(): void {
    this.dataService.deleteReport(this.inputForm.value as Report).subscribe(() => this.router.navigate(['/company-edit-report-overview']));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
