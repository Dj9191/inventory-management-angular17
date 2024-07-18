import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import Order from '../../../types/order';
import Product from '../../../types/product';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss'
})
export class OrderFormComponent {


  formbuilder = inject(FormBuilder);
  productService = inject(ProductService);
  toaster=inject(ToastrService);
 orderService=inject(OrderService);
  orderform = this.formbuilder.group<Order>(
    {
      orderNo: '',
      productId: '',
      quantity: null,
      salePrice: null,
      discount: null,
      totalAmount: null
    })

  products: Product[] = [];
  route=inject(ActivatedRoute);
  order!:Order;
  ngOnInit() {
    let id=this.route.snapshot.params['id'];
    console.log('id',id);
    if(id)
    {
      this.orderService.getOrder(id).subscribe((result)=>
      {
        this.order=result;
        
        this.orderform.patchValue(this.order);
        this.productService.getProducts().subscribe(
          (result) =>
          {
            this.products=result;
            this.selectedProduct=this.products.find(
              (x)=>x.id==this.order.productId
            );
            this.orderform.controls.productId.disable();
          } );
       // this.selectedProduct=this.products.find((x)=>x.id==this.order.productId);
       

        // this.productService.getProducts().subscribe(
        //   (result) =>
        //   {
        //     this.products=result;
        //     this.selectedProduct=this.products.find(
        //       (x)=>x.id==this.order.productId
        //     );

        //   } );
          // this.orderform.controls.productId.disable();
      });
    }
    else{
      this.productService.getProducts().subscribe(
        (result) =>
        {
          this.products=result;
          this.selectedProduct=this.products.find(
            (x)=>x.id==this.order.productId
          );
  
        } );
    }
    this.orderform.controls.orderNo.addValidators(Validators.required);
    this.orderform.controls.productId.addValidators(Validators.required);
    this.orderform.controls.quantity.addValidators(Validators.required);
   // this.orderform.controls.orderNo.addValidators(Validators.required);

    // this.productService.getProducts().subscribe(
    //   (result) => (this.products = result));
    
this.updateTotalAmount();
  }   

  router=inject(Router);

  addOrder()
  {
    if(this.orderform.invalid)
    {
      this.toaster.error("Please provide all details");
      return;
    }
    console.log(this.orderform.value);
    let formValue=this.orderform.getRawValue() as Order;

if(formValue.quantity!>this.selectedProduct!.availableQuantity)
{
  this.toaster.error('Only  ' +
   this.selectedProduct?.availableQuantity! +
    '  unit is left in inventory');

  return;
}


    this.orderService.addOrders(formValue).subscribe(()=>
    {
      this.selectedProduct!.availableQuantity -=formValue.quantity!;
      this.productService.updateProduct(this.selectedProduct!.id!,this.selectedProduct!).subscribe();
      this.toaster.success('your order added successfully');
      this.router.navigateByUrl('/orders');
    });
    //this.updateTotalAmount();
  }


  updateOrder()
  {
    if(this.orderform.invalid)
    {
      this.toaster.error("Please provide all details");
      return;
    }
    console.log(this.orderform.value);
    let formValue=this.orderform.getRawValue() as Order;

if(formValue.quantity!>this.selectedProduct!.availableQuantity+this.order.quantity!)
{
  this.toaster.error('Only  ' +
   this.selectedProduct?.availableQuantity! +
    '  unit is left in inventory');

  return;
}


    this.orderService.updateOrder(this.order.id!, formValue).subscribe(()=>
    {
      this.selectedProduct!.availableQuantity -=(formValue.quantity! - this.order.quantity!);
      this.productService.updateProduct(this.selectedProduct!.id!,this.selectedProduct!).subscribe();
      this.toaster.success('your order updated successfully');
      this.router.navigateByUrl('/orders');
    });
    //this.updateTotalAmount();
  }

  updateTotalAmount()
  {
    this.orderform.valueChanges.subscribe(()=>{
      this.orderform.controls.totalAmount.enable({emitEvent:false});
      if(this.orderform.getRawValue().productId && this.orderform.value.quantity)
      {
        let total=
        this.selectedProduct?.salePrice!*this.orderform.value.quantity-(this.orderform.value.discount||0);
        this.orderform.controls.totalAmount.setValue(total,
          {emitEvent:false})

      }
      this.orderform.controls.totalAmount.disable({emitEvent:false});

    });
  }

  selectedProduct?:Product;
  productSelected(productId:string)
  {
    this.selectedProduct=this.products.find((x)=>x.id==productId);
    this.orderform.controls.salePrice.enable();
    this.orderform.controls.salePrice.setValue(this.selectedProduct?.salePrice!);
    this.orderform.controls.salePrice.enable();
  }
}




