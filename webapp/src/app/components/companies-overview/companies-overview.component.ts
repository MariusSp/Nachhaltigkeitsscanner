import {  Component, OnInit } from '@angular/core';
import {  DataService } from 'src/app/service/data.service';



@Component({
  selector: 'app-companies-overview',
  templateUrl: './companies-overview.component.html',
})
export class CompaniesOverviewComponent implements OnInit {
  reports$ = this.dataService.getReports();

  constructor(
    private dataService: DataService,
  ) {}

  ngOnInit(): void {

    }
}
