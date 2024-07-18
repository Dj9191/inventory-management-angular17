import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import Product from '../../types/product';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-products',
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
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  
  dataSource!:MatTableDataSource<Product>;
  productService=inject(ProductService);
  product:Product[]=[];
  toaster=inject(ToastrService);
  displayedColumns=[
    'name',
    'details',
    'brandId',
    'purchasePrice',
    'salePrice',
    'availableQuantity',
    'action'

  ];
  @ViewChild(MatPaginator) pagination!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit()
  {
    this.productService.getProducts().subscribe((result)=>{
    this.product=result;
    this.initTable();
    });
  }

  initTable()
  {
    this.dataSource=new MatTableDataSource(this.product)
    this.dataSource.sort=this.sort;
    this.dataSource.paginator=this.pagination;
  }

  applyFilter(event:Event){
    this.dataSource.filter=(event.target as HTMLInputElement).value.trim().toLowerCase();
    this.pagination.firstPage();
  }

  DeleteProduct(product: Product) {
    this.productService.deleteProduct(product.id!).subscribe(() => {
      this.toaster.success("Product Deleted");
      this.productService.getProduct(product.id!).subscribe((products) => {
        products.availableQuantity = (+products.availableQuantity) ;
        // this.productService.updateProduct((products.id!,products!))
        // .subscribe();

        this.productService.updateProduct(products!.id!, products!).subscribe();

      });
      this.product = this.product.filter((x) => x.id != product.id);
      this.dataSource.data = this.product;

    });
  }
  
}
