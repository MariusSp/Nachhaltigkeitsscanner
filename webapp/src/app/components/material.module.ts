import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTabsModule} from '@angular/material/tabs';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatRippleModule} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
  imports: [MatButtonModule, MatTableModule, MatInputModule, MatSortModule, MatPaginatorModule, MatTabsModule,
    MatAutocompleteModule, MatToolbarModule, MatIconModule, MatMenuModule, MatRippleModule, MatCardModule,
    DragDropModule, MatDialogModule, MatSelectModule, MatListModule, MatDividerModule, ScrollingModule, MatTooltipModule],
  exports: [MatButtonModule, MatTableModule, MatInputModule, MatSortModule, MatPaginatorModule, MatTabsModule,
    MatAutocompleteModule, MatToolbarModule, MatIconModule, MatMenuModule, MatRippleModule, MatCardModule,
    MatListModule, DragDropModule, MatDialogModule, MatSelectModule, MatDividerModule, MatExpansionModule,
    ScrollingModule, MatTooltipModule],
})
export class MaterialModule {
}
