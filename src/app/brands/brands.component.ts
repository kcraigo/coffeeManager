import { Component, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { AlertService } from '../core/services/alert.service';
import { SharepointService } from '../core/services/sharepoint.service';

import { CoffeeInventory } from '../core/models/coffeeInventory';


@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent {
  coffeeInventory: CoffeeInventory[] = [];

  displayColumns: string[] = [
    'select',
    'Id',
    'Title',
    'Brand',
    'Description',
    'Organic',
    'Grower',
    'Region',
    'ReOrderLevel'
  ];

  dataSource = new MatTableDataSource<CoffeeInventory>();
  selection = new SelectionModel<CoffeeInventory>(true, []);

  constructor(
    private _notifierService: AlertService,
    private _sharepointService: SharepointService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(){
    this.getCoffeeInventory();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Does the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAlertSnackBar(): void {
    this._notifierService.addNotification(
      'From the CoffeeInventory Component',
      'success'
    );
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: CoffeeInventory): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.Id + 1
    }`;
  }

  clearTable() {
    this.dataSource.data = [];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private async getCoffeeInventory(): Promise<void> {
    try {
      this.coffeeInventory = await this._sharepointService.getCoffeeInventory();
      let results = this.coffeeInventory.value.map(r => ({
        Id: r.fields.id,
        title: r.fields.Title,
        brand: r.fields.brand,
        description: r.fields.Description,
        organic: r.fields.Organic,
        grower: r.fields.Grower,
        region: r.fields.Region,
        reOrderLevel: r.fields.ReOrderLevel
      }));

    console.log(`CoffeeInventory: ${results}`);
      // SharePoint DATA
    this.dataSource = new MatTableDataSource<CoffeeInventory>(results);


    } catch (error) {
      console.log(error);
    }
  }


}
