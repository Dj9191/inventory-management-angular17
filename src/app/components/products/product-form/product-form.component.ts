import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import { ProductService } from '../../../services/product.service';
import Brand from '../../../types/brand';
import Product from '../../../types/product';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule,MatInputModule,MatButtonModule,MatSelectModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
builder=inject(FormBuilder);

productForm:FormGroup=this.builder.group({
  name:['',[Validators.required]],
  details:[''],
  brandId:['',[Validators.required]],
  purchasePrice:['',[Validators.required]],
  salePrice:['',[Validators.required]],
  availableQuantity:['',[Validators.required]],
});

brandService=inject(BrandService);
productService=inject(ProductService);
toaster=inject(ToastrService);
brands:Brand[]=[];
router=inject(Router);
route=inject(ActivatedRoute);
product!:Product;
ngOnInit()
{
  let id=this.route.snapshot.params['id'];
  console.log(id);
  this.brandService.getBrands().subscribe((result)=>(this.brands=result));
  if(id){
    this.productService.getProduct(id).subscribe(result=>{
      this.product=result;
      this.productForm.patchValue(this.product);
    })
  }
}
addProduct()
{
  debugger;
  console.log(this.productForm.value)
  if(this.productForm.invalid)
  {
    this.toaster.error("Please Provide all the details")
    return;
  }

  let product:Product=this.productForm.value;
  this.productService.addProduct(product).subscribe((result)=>{
    this.toaster.success('Your Product is added Successfully');
    this.router.navigateByUrl('/products');
  });
}


updateProduct()
{
if(this.productForm.invalid)
{
  this.toaster.error('Please provide all details');
  return;
}
let product:Product=this.productForm.value;
this.productService.updateProduct(this.product.id!,product).subscribe((result)=>
{
this.toaster.success('Your Product is Updated successfully');
this.router.navigateByUrl('/products');
});
}
}
