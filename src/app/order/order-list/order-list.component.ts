import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['expand', 'id', 'date', 'totalPrice', 'actions'];
  innerDisplayedColumns: string[] = ['productId', 'quantity', 'price'];
  dataSource = new MatTableDataSource<Order>();
  expandedElement!: Order | null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe(data => {
      this.dataSource.data = data;
    });
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

  toggleRow(element: Order, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  navigateToAddOrder(): void {
    this.router.navigate(['/home/orders/add-order']);
  }

  navigateToEditOrder(orderId: number): void {
    this.router.navigate(['/home/orders/edit-order', orderId]);
  }

  deleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(orderId).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter(order => order.id !== orderId);
      });
    }
  }
}

export interface Order {
  id: number;
  date: Date;
  totalPrice: number;
  items: Item[];
}

export interface Item {
  productId: number;
  quantity: number;
  price: number;
}
