import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['expand', 'id', 'name', 'price', 'quantity', 'actions'];
  dataSource = new MatTableDataSource<Product>();
  expandedElement!: Product | null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private productService: ProductService, private router: Router,private translate: TranslateService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.dataSource.data = data;
    });
    this.translate.setDefaultLang('en');
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleRow(element: Product, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  navigateToAddProduct(): void {
    this.router.navigate(['/home/products/add-product']);
  }

  navigateToEditProduct(productId: number): void {
    this.router.navigate(['/home/products/edit-product', productId]);
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter(product => product.id !== productId);
      });
    }
  }

  
}
