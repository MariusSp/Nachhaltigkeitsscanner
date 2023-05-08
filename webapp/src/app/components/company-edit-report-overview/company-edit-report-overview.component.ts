import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Company, DataService, Report} from '../../service/data.service';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {shareReplay, switchMap} from 'rxjs/operators';
import {KeycloakService} from 'keycloak-angular';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-company-edit-report-overview',
  templateUrl: './company-edit-report-overview.component.html',
  styleUrls: ['./company-edit-report-overview.component.scss']
})
export class CompanyEditReportOverviewComponent implements OnInit, OnDestroy {
  reports$: Observable<Report[]>;
  company$: ReplaySubject<Company> = new ReplaySubject(1);
  dataSource: MatTableDataSource<any>;
  form: FormGroup;

  destroyed$ = new Subject();

  constructor(private dataService: DataService, private keycloakService: KeycloakService,
              private ref: ChangeDetectorRef, private dialog: MatDialog, private router: Router) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({year: new FormControl(null, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)])});

    this.dataService.getCompanyByUserId(this.keycloakService.getKeycloakInstance().subject)
      .subscribe((company: Company) => this.company$.next(company));
    this.reports$ = this.company$.pipe(
      switchMap((company: Company) => this.dataService.getReportsForCompany(company.id.toString())),
      shareReplay(1));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  sortedReports(reports: Report[]): Report[] {
    return reports.sort((r1, r2) => r2.year - r1.year);
  }

  onSubmitAdd(): void {
    if (this.form.invalid) {
      return;
    }
    const year = this.form.value.year;
    this.company$.pipe(switchMap(c => this.dataService.insertReport(c.id, year)))
      .subscribe(() => this.router.navigate(['/company-edit-report/' + year]));
  }
}
