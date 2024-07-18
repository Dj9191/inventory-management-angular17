import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import Order from '../types/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
//private httpClient=inject(HttpClient);
  constructor(private httpClient: HttpClient) { }
  getOrders()
  {
    //return this.httpClient.get<Order[]>(`${environment.apiUrl}/orders`); 
   return this.httpClient.get<Order[]>('http://localhost:3000/orders');
  //return this.httpClient.get<Order[]>('${environment.apiUrl}'+ '/orders');
  }

  addOrders(order:Order)
  {
    //return this.httpClient.get<Order[]>(`${environment.apiUrl}/orders`); 
   return this.httpClient.post<Order>('http://localhost:3000/orders',order);
  //return this.httpClient.get<Order[]>('${environment.apiUrl}'+ '/orders');
  }

  getOrder(orderId:string)
  {
  // return this.httpClient.get<Brand[]>(`${environment.apiUrl}/brands`);
  return this.httpClient.get<Order>('http://localhost:3000/orders/'+orderId);

  }

  updateOrder(id:string,order:Order)
{
  debugger
  //  return this.httpClient.put<Brand>('http://localhost:3000/brands/'+ brands.id,brands);

  return this.httpClient.put<Order>('http://localhost:3000/orders/'+ id,order);
 
}


deleteOrders(id:string)
{
  //return this.httpClient.get<Order[]>(`${environment.apiUrl}/orders`); 
 return this.httpClient.delete<Order[]>('http://localhost:3000/orders/'+id);
//return this.httpClient.get<Order[]>('${environment.apiUrl}'+ '/orders');
}
}
