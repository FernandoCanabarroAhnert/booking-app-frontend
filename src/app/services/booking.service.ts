import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreateBooking } from '../interfaces/booking/create-booking.interface';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private readonly _http = inject(HttpClient);

  readonly _baseUrl = 'http://localhost:8080/api/v1/bookings';

  printBoleto(amount: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    const options = {
      headers,
      responseType: 'blob' as const,
      params: { amount: amount.toString() }
    };
    return this._http.get(`${this._baseUrl}/boleto/pdf`, options);
  }

  createSelfBooking(bookingRequest: ICreateBooking): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    return this._http.post<void>(`${this._baseUrl}/self`, bookingRequest, { headers });
  }
  
}
