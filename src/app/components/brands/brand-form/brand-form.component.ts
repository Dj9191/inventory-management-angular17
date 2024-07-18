import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import Brand from '../../../types/brand';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [MatInputModule,MatButtonModule,MatFormFieldModule,FormsModule],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss'
})
export class BrandFormComponent {
  name!:string;
brandService=inject(BrandService);
router=inject(Router);
route=inject(ActivatedRoute);
brand!:Brand;

ngOnInit()
{
  const id = this.route.snapshot.params['id'];
  console.log(id);
  if(id){
    this.brandService.getBrand(id).subscribe((result)=>
    {
      this.brand = result;
      this.name=result.name;
    });
  }
}

  id: number | undefined;

addBrand()
{
  debugger
  console.log(this.name);
  if(!this.name){
    alert("Please enter brand name");
    return;

  }

  let brand:Brand={
    name:this.name
  }

  this.brandService.addBrands(brand).subscribe((result) =>
  {
this.router.navigateByUrl("/brands");
  });
}


updateBrand()
{
  debugger
  console.log(this.name);
  if(!this.name){
    alert("Please enter brand name");
    return;

  }

  let brand:Brand ={
    id:this.brand.id,
    name:this.name
  }

  this.brandService.updateBrands(brand).subscribe((result) =>
  {
    alert('Brand updated successfully');
this.router.navigateByUrl("/brands");
  });
}
}
