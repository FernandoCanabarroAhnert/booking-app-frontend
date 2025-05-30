import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreateBooking } from '../interfaces/booking/create-booking.interface';
import { IBookingDetailResponse } from '../interfaces/booking/booking-detail-response.interface';
import { IAdminCreateBookingRequest } from '../interfaces/booking/admin-create-booking-request.interface';
import { BookingList } from '../types/booking-list.type';
import { IPageResponse } from '../interfaces/page/page-response.interface';
import { IAdminUpdateBookingRequest } from '../interfaces/booking/admin-update-booking-request.interface';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private readonly _http = inject(HttpClient);

  readonly _baseUrl = 'http://localhost:8080/api/v1/bookings';

  findAllBookings(page: number = 1, size: number = 10, sort: string = 'id,asc', checkIn: string = '', checkOut: string = '',
      hotelId: number | string = '', minPrice: number | string = '', maxPrice: number | string = '', 
      paymentType: string[] = ['']): Observable<IPageResponse<BookingList>> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    return this._http.get<IPageResponse<BookingList>>(this._baseUrl, { headers, params: {
      page: page - 1, size, sort, checkIn, checkOut, hotelId, minPrice, maxPrice, paymentType
    }})
  }

  findById(id: number): Observable<IBookingDetailResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    return this._http.get<IBookingDetailResponse>(`${this._baseUrl}/${id}`, { headers });
  }

  createSelfBooking(bookingRequest: ICreateBooking): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    return this._http.post<void>(`${this._baseUrl}/self`, bookingRequest, { headers });
  }

  adminCreateBooking(request: IAdminCreateBookingRequest): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    return this._http.post<void>(this._baseUrl, request, { headers });
  }

  adminUpdateBooking(id: number, request: IAdminUpdateBookingRequest): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    return this._http.put<void>(`${this._baseUrl}/${id}`, request, { headers });
  }

  deleteBooking(id: number): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    return this._http.delete<void>(`${this._baseUrl}/${id}`, { headers });
  }

  findConnectedUserBookings(page: number = 1, size: number = 10): Observable<IPageResponse<IBookingDetailResponse[]>> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    return this._http.get<IPageResponse<IBookingDetailResponse[]>>(`${this._baseUrl}/my-bookings`, { headers, params: { page: page - 1, size } });
  } 

  exportToPdf(checkIn: string = '', checkOut: string = '', minAmount: number | string = '', maxAmount: number | string = '',
    dinheiro: string = '', cartao: string = '', pix: string = '', boleto: string = '', hotelId: number | string = ''
  ): Observable<Blob> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    return this._http.get(`${this._baseUrl}/pdf`, { headers, responseType: 'blob', params: {
      minCheckInDate: checkIn, maxCheckOutDate: checkOut, minAmount, maxAmount, dinheiro, cartao, pix, boleto, hotelId
    }});
  }

  exportToExcel(): Observable<Blob> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    return this._http.get(`${this._baseUrl}/excel`, { headers, responseType: 'blob' });
  }
 
  printBoleto(amount: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    const options = {
      headers,
      responseType: 'blob' as const,
      params: { amount: amount.toString() }
    };
    return this._http.get(`${this._baseUrl}/boleto/pdf`, options);
  }

  
  
}
