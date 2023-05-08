import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Observable, ReplaySubject, Subject} from 'rxjs';
import {DataService, Report} from '../../service/data.service';
import {MatTableDataSource} from '@angular/material/table';
import {LegendPosition} from '@swimlane/ngx-charts';
import {FormControl, FormGroup} from "@angular/forms";
import {map, shareReplay, startWith, switchMap, take, takeUntil, tap} from "rxjs/operators";
import {Translation} from '../display-report/display-report.component';

const NOT_IN_CHART = ['id', 'year', 'company', 'revenue', 'employees', 'normalWaste', 'dangerousWaste'];

@Component({
    selector: 'app-companies-comparison',
    templateUrl: './companies-comparison.component.html',
    styleUrls: ['./companies-comparison.component.scss']
})
export class CompaniesComparisonComponent implements OnInit, OnDestroy {
    below = LegendPosition.Below;
    data2;

    companies$ = this.dataService.getCompanies().pipe(shareReplay());
    reports$: ReplaySubject<Report[]> = new ReplaySubject();
    years$; // todo charts need years of reports here, that both companies share
    dataSource: MatTableDataSource<any>;
    form: FormGroup = new FormGroup({
        company1: new FormControl(), company2: new FormControl(), year: new FormControl()
    });
    destroy$ = new Subject();
    company1Report$: Observable<Report[]>;
    company2Report$: Observable<Report[]>;

    constructor(private dataService: DataService, private translationService: Translation) {
    }

    ngOnInit(): void {
        this.company1Report$ = this.form.controls.company1.valueChanges.pipe(takeUntil(this.destroy$),
            switchMap(company => this.dataService.getReportsForCompany(company.id).pipe(take(1))), startWith([]),
            shareReplay());
        this.company2Report$ = this.form.controls.company2.valueChanges.pipe(takeUntil(this.destroy$),
            switchMap(company => this.dataService.getReportsForCompany(company.id).pipe(take(1))), startWith([]),
            shareReplay());
        this.years$ = combineLatest([this.company1Report$, this.company2Report$])
            .pipe(takeUntil(this.destroy$), map(([reports1, reports2]: [Report[], Report[]]) => {
                return Array.from(
                    new Set(reports1.map(report => report.year).concat(reports2.map(report => report.year))));
            }));

        combineLatest([this.company1Report$, this.company2Report$, this.form.controls.year.valueChanges])
            .pipe(takeUntil(this.destroy$)).subscribe(([reports1, reports2, year]) => {
            const data2 = [];
            const reports = [];
            const r1 = reports1.filter(report => report.year === year);
            if (r1.length > 0) {
                reports.push(r1[0]);
                const data = {name: r1[0].company.name, series: []};
                Object.keys(r1[0]).forEach(attribute => {
                    if (r1[0][attribute] != null && NOT_IN_CHART.indexOf(attribute) === -1) {
                        data.series.push({value: r1[0][attribute], name: this.translationService.translate(attribute)});
                    }
                });
                data2.push(data);
            }
            const r2 = reports2.filter(report => report.year === year);
            if (r2.length > 0) {
                reports.push(r2[0]);
                const data = {name: r2[0].company.name, series: []};
                Object.keys(r2[0]).forEach(attribute => {
                    if (r2[0][attribute] != null && NOT_IN_CHART.indexOf(attribute) === -1) {
                        data.series.push({value: r2[0][attribute], name: this.translationService.translate(attribute)});
                    }
                });
                data2.push(data);
            }
            this.data2 = data2;
            this.reports$.next(reports);
        });
    }

    onSelect(data): void {
        console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }

    onActivate(data): void {
        console.log('Activate', JSON.parse(JSON.stringify(data)));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
