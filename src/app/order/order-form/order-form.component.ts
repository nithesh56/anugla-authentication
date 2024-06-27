import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Order, Item } from '../order-list/order-list.component';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/product/models/product.model';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;
  isEditMode = false;
  products: Product[] = [];
  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router, private productService: ProductService
  ) {
    this.orderForm = this.fb.group({
      id: ['', Validators.required],
      date: ['', Validators.required],
      items: this.fb.array([this.createItem()])
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.orderService.getOrderById(+id).subscribe(order => {
        this.orderForm.patchValue(order);
        this.orderForm.patchValue({ date: new Date(order.date) }); // Convert date string to Date object
        this.setItems(order.items);
      });
    }
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

 

  setItems(items: Item[]): void {
    const itemFGs = items.map(item => this.fb.group(item));
    const itemFormArray = this.fb.array(itemFGs);
    this.orderForm.setControl('items', itemFormArray);
  }

  getTotalPrice(): number {
    return this.items.controls.reduce((total, control) => {
      const price = control.get('price')?.value || 0;
      const quantity = control.get('quantity')?.value || 0;
      return total + (price * quantity);
    }, 0);
  }
  getProductName(productId: number | null | undefined): string {
    if (productId === null || productId === undefined) {
      return ''; // Return a default value or handle accordingly
    }
    // Your logic to get the product name based on productId
    const product = this.products.find(p => p.id === productId);
    return product ? product.name : '';
  }
  onSubmit(): void {
    const order: Order = this.orderForm.value;
    order.totalPrice = this.getTotalPrice();

    if (this.isEditMode) {
      this.orderService.updateOrder(order).subscribe(() => {
        this.router.navigate(['/home/orders']);
      });
    } else {
      this.orderService.addOrder(order).subscribe(() => {
        this.router.navigate(['/home/orders']);
      });
    }
  }
}
