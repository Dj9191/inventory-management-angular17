import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import Brand from '../types/brand';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private httpClient: HttpClient) { }
 //private httpClient =inject(HttpClient);
  getBrands()
  {
  // return this.httpClient.get<Brand[]>(`${environment.apiUrl}/brands`);
  return this.httpClient.get<Brand[]>('http://localhost:3000/brands');

  }
  getBrand(brandId:string)
  {
  // return this.httpClient.get<Brand[]>(`${environment.apiUrl}/brands`);
  return this.httpClient.get<Brand>('http://localhost:3000/brands/'+brandId);

  }

  addBrands(brands:Brand)
  {
  // return this.httpClient.get<Brand[]>(`${environment.apiUrl}/brands`);
  return this.httpClient.post<Brand>('http://localhost:3000/brands',brands);
  }

  updateBrands(brands:Brand)
  {
  // return this.httpClient.get<Brand[]>(`${environment.apiUrl}/brands`);
  return this.httpClient.put<Brand>('http://localhost:3000/brands/'+ brands.id,brands);

  }
}
