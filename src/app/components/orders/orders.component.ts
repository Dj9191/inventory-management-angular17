import { Component, Inject, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import Order from '../../types/order';
import Product from '../../types/product';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginator,
    MatPaginatorModule,
    RouterLink
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  dataSource!: MatTableDataSource<Order>;
  productService = inject(ProductService);
  orderService = inject(OrderService);
  products: Product[] = [];
  order: Order[] = [];
  toaster=inject(ToastrService);
  displayedColumns = [
    'orderNo',
    'productId',
    'quantity',
    'salePrice',
    'discount',
    'totalAmount',
    'action'
  ];
  @ViewChild(MatPaginator) pagination!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit() {
    this.productService.getProducts().subscribe((resul) => (
      this.products = resul));


    this.orderService.getOrders().subscribe((result) => {
      this.order = result;
      this.initTable();
    });
  }

  initTable() {
    this.dataSource = new MatTableDataSource(this.order)
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.pagination;
  }

  applyFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value
      .trim().toLowerCase();
    this.pagination.firstPage();
  }

  getProductName(id: string) {
    return this.products.find(x => x.id == id)?.name;
  }

  cancelOrder(order: Order) {
    this.orderService.deleteOrders(order.id!).subscribe(() => {
      this.toaster.success("Order cancelled");
      this.productService.getProduct(order.productId!).subscribe((products) => {
        products.availableQuantity = (+products.availableQuantity) + (+order.quantity!);
        // this.productService.updateProduct((products.id!,products!))
        // .subscribe();

        this.productService.updateProduct(products!.id!, products!).subscribe();

      });
      this.order = this.order.filter((x) => x.id != order.id);
      this.dataSource.data = this.order;

    });
  }
}
