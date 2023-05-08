import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Report} from '../../service/data.service';
import {MatTableDataSource} from '@angular/material/table';
import {LegendPosition} from '@swimlane/ngx-charts';
import {Translation} from '../display-report/display-report.component';

const NOT_IN_CHART = ['id', 'year', 'company', 'revenue', 'employees', 'normalWaste', 'dangerousWaste'];

@Component({
  selector: 'app-display-chart',
  templateUrl: './display-chart.component.html',
  styleUrls: ['./display-chart.component.scss']
})
export class DisplayChartComponent implements OnChanges {
  @Input() reports: Report[];
  below = LegendPosition.Below;
  data = [];

  dataSource: MatTableDataSource<any>;

  constructor(private translationService: Translation) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.reports.currentValue != null) {
      this.data = this.mapReportToChartConfig(changes.reports.currentValue);
    } else {
      this.data = [];
    }
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  mapReportToChartConfig(reports: Report[]): { name: string, series: any[] }[] {
    const data = {};
    reports.sort((a, b) => a.year - b.year);
    reports.forEach(report => {
      const r = {...report};
      Object.keys(r).forEach(attribute => {
        // if (report[attribute] != null) {
        if (report[attribute] == null || NOT_IN_CHART.indexOf(attribute) > -1) {
          return;
        }
        if (data[attribute] == null) {
          data[attribute] = {name: this.translationService.translate(attribute), series: []};
        }
        data[attribute].series.push({value: report[attribute], name: report.year});
        // }
      });
    });
    return Object.values(data);
  }
}
