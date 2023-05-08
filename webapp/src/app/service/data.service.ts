import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class DataService {
  readonly backendUrl = '/api';

  constructor(private http: HttpClient) {
  }

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.backendUrl + '/companies');
  }

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(this.backendUrl + '/reports');
  }

  getAvailableCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.backendUrl + '/availableCompanies');
  }

  getReportsForCompany(companyID: string): Observable<Report[]> {
    return this.http.get<Report[]>(this.backendUrl + `/reports/${companyID}`);
  }

  getReportByYearByCompany(companyID: number, year: number): Observable<Report> {
    return this.http.get<Report>(this.backendUrl + `/reports/${companyID}/${year}`);
  }

  editCompanyReport(report: Report): Observable<Report> {
    return this.http.put<Report>(this.backendUrl + `/reports`, report);
  }

  insertReport(companyId: number, year: number): Observable<Report> {
    return this.http.post<Report>(this.backendUrl + '/reports', {companyId, year});
  }

  editCompanyData(company: Company): Observable<Company> {
    return this.http.put<Company>(this.backendUrl + '/companies', company);
  }

  getCompanyByUserId(userid: string): Observable<Company> {
    const options = {
      params: new HttpParams().append('userid', userid),
    };
    return this.http.get<Company>(this.backendUrl + '/companyByUserId', options);
  }

  getCompanyByID(id: string): Observable<Company> {
    return this.http.get<Company>(this.backendUrl + `/companies/${id}`);
  }

  insertCompany(name: string): Observable<Company> {
    return this.http.post<Company>(this.backendUrl + '/companies', name);
  }

  assingUserToCompany(company: Company, userId: string): Observable<Company> {
    return this.http.post<Company>(`${this.backendUrl}/companies/${company.id}`, userId);
  }

  deleteReport(report: Report): Observable<Report> {
    return this.http.post<Report>(this.backendUrl + '/reports/remove', report);
  }

}

export interface Company {
  id: number;
  name: string;
  userId: string;
  contact: string;
  homepage: string;
  info: string;
  ceo: string;
  phonenumber: string;
  address: string;
  sectors: string[];
  headquarters: string;
  emas3: boolean;
  iso14001: boolean;
  iso45001: boolean;
  iso50001: boolean;
  iso9001: boolean;
}

export interface Report {
  id: number;
  company: Company;
  year: number;
  employees: number;
  revenue: number;
  energyConsumption: number;
  gasConsumption: number;
  waterConsumption: number;
  electricityConsumption: number;
  dangerousWaste: number;
  normalWaste: number;
  CO2Emissions: number;
  resourcesInput: number;
  resourcesOutput: number;
}
