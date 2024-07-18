import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import Product from '../types/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
//private httpclient =inject(HttpClient);

  constructor(private httpClient: HttpClient) { }

getProducts()
{
  //return this.httpClient.get<Product[]>(`${environment.apiUrl}/products`);
 return this.httpClient.get<Product[]>('http://localhost:3000/products');
}

getProduct(productId:string)
  {
  // return this.httpClient.get<Brand[]>(`${environment.apiUrl}/brands`);
  return this.httpClient.get<Product>('http://localhost:3000/products/'+productId);

  }
addProduct(product:Product)
{
  debugger
  return this.httpClient.post<Product>('http://localhost:3000/products/',product);
 
}
updateProduct(id:string,product:Product)
{
  debugger
  //  return this.httpClient.put<Brand>('http://localhost:3000/brands/'+ brands.id,brands);

  return this.httpClient.put<Product>('http://localhost:3000/products/'+ id,product);
 
}

deleteProduct(id:string)
{
  //return this.httpClient.get<Order[]>(`${environment.apiUrl}/orders`); 
 return this.httpClient.delete<Product[]>('http://localhost:3000/products/'+id);
//return this.httpClient.get<Order[]>('${environment.apiUrl}'+ '/orders');
}
}
