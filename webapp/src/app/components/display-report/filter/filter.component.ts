import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-company-comparision',
  templateUrl: './filter.component.html',
})
export class FilterComponent implements OnInit {
  form: FormGroup;
  stringOperator = ['!=', '==', 'includes', 'not includes'];
  numberOperator = [
    '!=',
    '==',
    'includes',
    'not includes',
    '>',
    '>=',
    '<',
    '<=',
  ];

  constructor(
    private dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { [column: string]: string }
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({});
    this.addFilter();
  }

  getControlNames(): string[]{
    return Object.keys(this.form?.controls);
  }

  getObjectKeys(obj): string[] {
    return Object.keys(obj);
  }

  addFilter(): void {
    this.form.addControl(
      'control' + Object.keys(this.form.controls).length,
      new FormGroup({
        column: new FormControl('', [Validators.required]),
        operator: new FormControl('', [Validators.required]),
        filter: new FormControl('', [Validators.required]),
      })
    );
  }

  removeFilter(name: string): void {
    if (Object.keys(this.form.controls).length <= 1) {
      return;
    }
    this.form.removeControl(name);
  }

  submit(): void {
    const allFilter = [];
    Object.keys(this.form.controls).forEach((element) => {
      allFilter.push(this.form.controls[element].value);
    });
    this.dialogRef.close(allFilter);
  }
  cancel(): void {
    this.dialogRef.close();
  }
}
