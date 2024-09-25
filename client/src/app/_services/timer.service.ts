import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Timer } from '../_models/timer';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  timers = signal<Timer[]>([]);

  getTimers(groupId: number){
    return this.http.get<Timer[]>(`${this.baseUrl}groups/${groupId}/maps`).subscribe({
      next: timers => this.timers.set(timers)
    });
  }
}
