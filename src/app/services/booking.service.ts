import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreateBooking } from '../interfaces/booking/create-booking.interface';
import { IBookingDetailResponse } from '../interfaces/booking/booking-detail-response.interface';
import { IAdminCreateBookingRequest } from '../interfaces/booking/admin-create-booking-request.interface';
import { BookingList } from '../types/booking-list.type';
import { IPageResponse } from '../interfaces/page/page-response.interface';
import { IAdminUpdateBookingRequest } from '../interfaces/booking/admin-update-booking-request.interface';
import { IBookingDashboardSummary } from '../interfaces/booking/booking-dashboard-summary.interface';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private readonly _http = inject(HttpClient);

  readonly _baseUrl = 'http://localhost:8080/api/v1/bookings';

  findAllBookings(page: number = 1, size: number = 10, sort: string = 'id,asc', checkIn: string = '', checkOut: string = '',
      hotelId: number | string = '', minPrice: number | string = '', maxPrice: number | string = '', 
      paymentType: string[] = ['']): Observable<IPageResponse<BookingList>> {
    return this._http.get<IPageResponse<BookingList>>(this._baseUrl, { params: {
      page: page - 1, size, sort, checkIn, checkOut, hotelId, minPrice, maxPrice, paymentType
    }})
  }

  findById(id: number): Observable<IBookingDetailResponse> {
    return this._http.get<IBookingDetailResponse>(`${this._baseUrl}/${id}`, {});
  }

  createSelfBooking(bookingRequest: ICreateBooking): Observable<void> {
    return this._http.post<void>(`${this._baseUrl}/self`, bookingRequest, {});
  }

  adminCreateBooking(request: IAdminCreateBookingRequest): Observable<void> {
    return this._http.post<void>(this._baseUrl, request, {});
  }

  adminUpdateBooking(id: number, request: IAdminUpdateBookingRequest): Observable<void> {
    return this._http.put<void>(`${this._baseUrl}/${id}`, request, {});
  }

  deleteBooking(id: number): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}/${id}`, {});
  }

  findConnectedUserBookings(page: number = 1, size: number = 10): Observable<IPageResponse<IBookingDetailResponse[]>> {
    return this._http.get<IPageResponse<IBookingDetailResponse[]>>(`${this._baseUrl}/my-bookings`, { params: { page: page - 1, size } });
  }
  
  getDashboardSummary(hotelId: number | string = ''): Observable<IBookingDashboardSummary> {
    return this._http.get<IBookingDashboardSummary>(`${this._baseUrl}/stats`, { params: { hotelId } });
  }

  exportToPdf(checkIn: string = '', checkOut: string = '', minAmount: number | string = '', maxAmount: number | string = '',
    dinheiro: string = '', cartao: string = '', pix: string = '', boleto: string = '', hotelId: number | string = ''
  ): Observable<Blob> {
    return this._http.get(`${this._baseUrl}/pdf`, { responseType: 'blob', params: {
      minCheckInDate: checkIn, maxCheckOutDate: checkOut, minAmount, maxAmount, dinheiro, cartao, pix, boleto, hotelId
    }});
  }

  exportToExcel(): Observable<Blob> {
    return this._http.get(`${this._baseUrl}/excel`, { responseType: 'blob' });
  }
 
  printBoleto(amount: number) {
    const options = {
      responseType: 'blob' as const,
      params: { amount: amount.toString() }
    };
    return this._http.get(`${this._baseUrl}/boleto/pdf`, options);
  }

  
  
}
