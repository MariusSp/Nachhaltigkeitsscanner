import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Company} from '../../service/data.service';
import {ReplaySubject} from 'rxjs';

@Component({
  selector: 'app-company-icon',
  templateUrl: './company-icon.component.html',
  styleUrls: ['./company-icon.component.scss']
})
export class CompanyIconComponent implements OnChanges {
  @Input() companyName: string;
  @Input() size: number;

  firstLetter$ = new ReplaySubject(1);

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.firstLetter$.next(changes.companyName.currentValue.substr(0, 1).toUpperCase());
  }

}
