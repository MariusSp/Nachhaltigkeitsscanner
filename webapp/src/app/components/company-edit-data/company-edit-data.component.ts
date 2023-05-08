import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReplaySubject, Subject} from 'rxjs';
import {Company, DataService} from '../../service/data.service';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {KeycloakUserService} from '../../service/keycloak.service';
import {KeycloakService} from 'keycloak-angular';
import {Router} from '@angular/router';
import {ErrorStateMatcher} from '@angular/material/core';
import {filter, map, takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-company-edit-data',
  templateUrl: './company-edit-data.component.html',
  styleUrls: ['./company-edit-data.component.scss']
})
export class CompanyEditDataComponent implements OnInit, OnDestroy {
  company$: ReplaySubject<Company> = new ReplaySubject(1);
  inputForm: FormGroup;
  destroyed$ = new Subject();

  dataFormControl = new FormControl('', [
    Validators.required
  ]);
  matcher = new MyErrorStateMatcher();


  constructor(private keycloakUserService: KeycloakUserService, private keycloakService: KeycloakService,
              private dataService: DataService, private router: Router) {
  }

  ngOnInit(): void {
    // Load UserProfile
    this.dataService.getCompanyByUserId(this.keycloakService.getKeycloakInstance().subject)
      .subscribe((company: Company) => this.company$.next(company));
    this.company$.pipe(takeUntil(this.destroyed$), filter(v => v != null), map(company => {
      const c = {};
      Object.keys(company)
        .forEach(key => c[key] = new FormControl(company[key], []));
      return c;
    }))
      .subscribe((company) => {
        console.log(company);
        this.inputForm = new FormGroup(company);
      });
  }

  onSubmitEdit(): void {
    const value = this.inputForm.value;
    if (typeof value.sectors === 'string') {
      value.sectors = value.sectors?.split(',').filter(v => v != null && v.trim() !== '');
    }
    this.dataService.editCompanyData(this.inputForm.value).subscribe(() => this.router.navigate(['/profile/-1']));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
