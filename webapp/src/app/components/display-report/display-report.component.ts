import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Injectable,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Pipe,
    PipeTransform,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTab} from '@angular/material/tabs';
import {ReplaySubject, Subject} from 'rxjs';
import {DataService, Report} from '../../service/data.service';
import {map, take, takeUntil, tap} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {FilterComponent} from './filter/filter.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {CompaniesOverviewComponent} from '../companies-overview/companies-overview.component';

interface Filter {
    column: string;
    operator: '==' | '!=' | 'includes' | 'not includes' | '>' | '>=' | '<' | '<=';
    filter: string;
}

const COLUMNS_ORDER = 'ColumnsOrder';

@Component({
    selector: 'app-display-report',
    templateUrl: './display-report.component.html',
    styleUrls: ['./display-report.component.scss']
})
export class DisplayReportComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTab) tab: MatSort;
    @Input() reports: Report[];
    @Input() showCompanyInformation = false;

    reports$: ReplaySubject<Report[]> = new ReplaySubject();
    columns = ['name', 'year', 'energyConsumption', 'gasConsumption', 'waterConsumption'];
    notDisplayedColumns = ['companyID', 'info', 'contact', 'homepage', 'ceo', 'phonenumber', 'address'];
    neverDisplayed = ['userId'];
    dataSource: MatTableDataSource<any>;

    destroyed$ = new Subject();

    constructor(private dataService: DataService, private ref: ChangeDetectorRef, private dialog: MatDialog) {
    }

    ngOnInit(): void {
        if (localStorage.getItem(DisplayReportComponent.name + ':' + COLUMNS_ORDER)) {
            this.columns = JSON.parse(localStorage.getItem(DisplayReportComponent.name + ':' + COLUMNS_ORDER));
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.reports) {
            this.reports$.next(changes.reports.currentValue ? changes.reports.currentValue : []);
        }
    }

    ngAfterViewInit(): void {
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSource.filterPredicate = (data: any, filter: string) => {
            const f: Filter[] = JSON.parse(filter);
            for (const fil of f) {
                if (!this.checkFilter(fil, data)) {
                    return false;
                }
            }
            return true;
        };

        this.setupDataChangeListener();
    }

    displayedColumns = () => this.showCompanyInformation ? ['account-icon', ...this.columns] : this.columns;


    applyFilter(): void {
        const columns = {};
        this.columns.forEach((element) => {
            columns[element] = typeof this.dataSource.data[0][element];
        });
        this.dialog
            .open(FilterComponent, {data: columns})
            .afterClosed()
            .pipe(take(1))
            .subscribe((filter: Filter[]) => {
                if (filter == null) {
                    return;
                }

                this.dataSource.filter = JSON.stringify(filter);

                if (this.dataSource.paginator) {
                    this.dataSource.paginator.firstPage();
                }
            });
    }

    removeFilter(): void {
        this.dataSource.filter = JSON.stringify([]);

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
    }

    drop(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
        localStorage.setItem(CompaniesOverviewComponent.name + ':' + COLUMNS_ORDER, JSON.stringify(this.columns));
    }

    flattenReport(r: Report): any {
        const c = r.company;
        const rc = {...r};
        delete rc.company;
        delete rc.id;
        return this.showCompanyInformation ? {
            ...rc, name: c.name, companyID: c.id, sectors: c.sectors, userId: c.userId
        } : {...rc};
    }

    private checkFilter(filter: Filter, data: any): boolean {
        switch (filter.operator) {
            case '==':
                return data[filter.column].toString() === filter.filter;
            case '!=':
                return data[filter.column].toString() !== filter.filter;
            case 'includes':
                return data[filter.column].toString().includes(filter.filter);
            case 'not includes':
                return !data[filter.column].toString().includes(filter.filter);
            case '>':
                return data[filter.column] > +filter.filter;
            case '>=':
                return data[filter.column] >= +filter.filter;
            case '<':
                return data[filter.column] < +filter.filter;
            case '<=':
                return data[filter.column] <= +filter.filter;
        }
        return true;
    }

    private setupDataChangeListener(): void {
        this.reports$
            .pipe(takeUntil(this.destroyed$), tap(console.log),
                map((reports: Report[]) => reports.map(report => this.flattenReport(report))),
                tap((companies: any[]) => (this.dataSource.data = companies)), tap((reports: any[]) => {
                    if (reports.length === 0) {
                        return;
                    }
                    this.columns = Object.keys(reports[0])
                        .filter(column => this.notDisplayedColumns.indexOf(column) === -1)
                        .filter(column => this.neverDisplayed.indexOf(column) === -1)
                        .sort((r1, r2) => {
                            let i1 = this.columns.indexOf(r1);
                            i1 = i1 !== -1 ? i1 : Number.MAX_SAFE_INTEGER;
                            let i2 = this.columns.indexOf(r2);
                            i2 = i2 !== -1 ? i2 : Number.MAX_SAFE_INTEGER;
                            return i1 - i2;
                        });
                }))
            .subscribe(() => this.ref.detectChanges());
    }

}

@Pipe({name: 'filterToString'})
export class FilterToStringPipe implements PipeTransform {
    transform(value: string): string {
        const filter = JSON.parse(value);
        let toString: string = null;
        for (const f of filter) {
            if (toString == null) {
                toString = this.filterToString(f);
            } else {
                toString = `${toString} und ${this.filterToString(f)}`;
            }
        }
        return toString;
    }

    filterToString(filter: Filter): string {
        return `${translations[filter.column] ? translations[filter.column] :
            filter.column} ${filter.operator} ${filter.filter}`;
    }
}


// TODO: Replace with internationalization
const translations = {
    name: 'Name',
    year: 'Jahr',
    employees: 'Mitarbeiter',
    headquarter: 'Hauptsitz',
    sector: 'Branche',
    sectors: 'Branchen',
    revenue: 'Umsatz (Mio.)',
    energyConsumption: 'Energieverbrauch (MWh)',
    gasConsumption: 'Gasverbrauch (MWh)',
    electricityConsumption: 'Stromverbrauch (MWh)',
    waterConsumption: 'Wasserverbrauch (m3)',
    dangerousWaste: 'gefährlicher Abfall (t)',
    normalWaste: 'Normaler Abfall (t)',
    co2Emissions: 'CO2-Emissionen (t)',
    resourcesInput: 'Ressourcen Input (t)',
    resourcesOutput: 'Ressourcen Output (t)',

    contact: 'Kontakt',
    homepage: 'Homepage',
    info: 'Info',
    ceo: 'CEO',
    phonenumber: 'Telefonnummer',
    address: 'Adresse'
};

@Pipe({name: 'translateColumn'})
export class TranslateColumnPipe implements PipeTransform {
    constructor(private translationService: Translation) {
    }
    transform(value: string): string {
        return this.translationService.translate(value);
    }
}

@Injectable()
export class Translation {
    translate(value: string): string {
        return translations[value] ? translations[value] : value
    }
}