import { inject, Injectable, signal } from '@angular/core';
import { Group } from '../_models/group';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  groups = signal<Group[]>([]);

  getGroups(){
    return this.http.get<Group[]>(this.baseUrl + "groups/all").subscribe({
      next: groups => this.groups.set(groups)
    });
  }

  deleteGroup(groupId: number){
    return this.http.delete(this.baseUrl + "groups/" + groupId).subscribe({
      next: () => this.groups.update(x => x.filter(group => group.id != groupId))
    });
  }

  createGroup(model: any){
    return this.http.post<Group>(this.baseUrl + "groups", model).pipe(
      tap(group => this.groups.update(x => [group, ...x]))
    )
  }
}
