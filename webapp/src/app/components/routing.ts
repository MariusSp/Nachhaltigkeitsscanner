import {Routes} from '@angular/router';
import {AppAuthGuard} from '../app-auth-guard';
import {AppWrapperComponent} from './app-wrapper/app-wrapper.component';
import {CompaniesOverviewComponent} from './companies-overview/companies-overview.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {ProfileComponent} from './profile/profile.component';
import {ContactComponent} from './contact/contact.component';
import {LicenceComponent} from './licence/licence.component';
import {CompanyEditDataComponent} from './company-edit-data/company-edit-data.component';
import {CompanyEditReportComponent} from './company-edit-report/company-edit-report.component';
import {CompanyEditReportOverviewComponent} from './company-edit-report-overview/company-edit-report-overview.component';
import {CompaniesComparisonComponent} from "./companies-comparison/companies-comparison.component";

export const ROUTES: Routes = [
  {
    path: '',
    canActivate: [AppAuthGuard],
    component: AppWrapperComponent,
    children: [
      {
        path: 'welcome',
        component: WelcomeComponent,
        data: {name: 'Willkommen'},
      },
      {
        path: 'companies-overview',
        component: CompaniesOverviewComponent,
        data: {name: 'Unternehmensliste', header: true},
      },
      {
        path: 'companies-comparison',
        component: CompaniesComparisonComponent,
        data: {name: 'Unternehmensvergleich', header: true},
      },
      {
        // id of -1 matches with current logged in user
        path: 'profile/:companyID',
        component: ProfileComponent,
        // data: { name: 'Mein Profil', header: true },
      },
      {
        path: 'licence',
        component: LicenceComponent,
        data: {name: 'Lizenz'},
      },
      {
        path: 'contact',
        component: ContactComponent,
        data: {name: 'Kontakt'},
      },
      {
        path: 'company-edit-data',
        component: CompanyEditDataComponent,
        data: {roles: ['user', 'admin'], name: 'Stammdaten bearbeiten'},
      },
      {
        path: 'company-edit-report-overview',
        component: CompanyEditReportOverviewComponent,
        data: {roles: ['user', 'admin'], name: 'Kennzahlen bearbeiten'},
      },
      {
        path: 'company-edit-report/:year',
        component: CompanyEditReportComponent,
        data: {roles: ['user', 'admin'], name: 'Kennzahlen bearbeiten'},
      },
      {path: '**', redirectTo: '/welcome'},
    ],
  },
  {path: '**', redirectTo: '/welcome'},
];
