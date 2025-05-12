import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private readonly _loadingSubject = new BehaviorSubject<boolean>(false);
  private _loadingMap: Map<string, boolean> = new Map<string, boolean>();
  readonly loading$ = this._loadingSubject.asObservable();

  setLoading(url: string, loading: boolean) {
    if (loading) {
      this._loadingMap.set(url, loading);
      this.showLoading();
    }
    else if (this._loadingMap.has(url) && !loading) {
      this._loadingMap.delete(url);
    }
    if (this._loadingMap.size === 0) {
      this.hideLoading();
    }
  }

  private showLoading() {
    this._loadingSubject.next(true);
  }

  private hideLoading() {
    this._loadingSubject.next(false);
  }

}
