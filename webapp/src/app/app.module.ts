import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {ROUTES} from './components/routing';
import {MaterialModule} from './components/material.module';
import {HttpClientModule} from '@angular/common/http';
import {DataService} from './service/data.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {KeycloakService} from 'keycloak-angular';
import {AppAuthGuard} from './app-auth-guard';
import {initializer} from 'src/KeycloakInit';
import {AppWrapperComponent} from './components/app-wrapper/app-wrapper.component';
import {ProfileComponent} from './components/profile/profile.component';
import {LogoComponent} from './components/logo/logo.component';
import {ContactComponent} from './components/contact/contact.component';
import {CompaniesOverviewComponent} from './components/companies-overview/companies-overview.component';
import {FilterComponent} from './components/display-report/filter/filter.component';
import {LicenceComponent} from './components/licence/licence.component';
import {
    DisplayReportComponent, FilterToStringPipe, TranslateColumnPipe, Translation
} from './components/display-report/display-report.component';
import {KeycloakUserService} from './service/keycloak.service';
import {CompanyEditDataComponent} from './components/company-edit-data/company-edit-data.component';
import {CompanyEditReportComponent} from './components/company-edit-report/company-edit-report.component';
import {CompanyEditReportOverviewComponent} from './components/company-edit-report-overview/company-edit-report-overview.component';
import {CompanyIconComponent} from './components/company-icon/company-icon.component';
import {DisplayChartComponent} from './components/display-chart/display-chart.component';
import { CompaniesComparisonComponent } from './components/companies-comparison/companies-comparison.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    AppWrapperComponent,
    ProfileComponent,
    LogoComponent,
    CompaniesOverviewComponent,
    FilterComponent,
    ContactComponent,
    LicenceComponent,
    DisplayReportComponent,
    FilterToStringPipe,
    TranslateColumnPipe,
    CompanyEditDataComponent,
    CompanyEditReportComponent,
    CompanyEditReportOverviewComponent,
    CompanyIconComponent,
    DisplayChartComponent,
    CompaniesComparisonComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxChartsModule,
  ],
  providers: [
      Translation,
    DataService,
    KeycloakUserService,
    KeycloakService,
    AppAuthGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
