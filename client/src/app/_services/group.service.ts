import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Group } from '../_models/group';
import { AccountService } from './account.service';
import { GroupMember } from '../_models/groupMember';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  groups = signal<Group[]>([]);

  getGroups(){
    return this.http.get<Group[]>(this.baseUrl + "groups").subscribe({
      next: groups => this.groups.set(groups)
    });
  }

  getGroup(id: number){
    const group = this.groups().find(x => x.id == id);
    if (group != undefined) return of(group);
    
    return this.http.get<Group>(this.baseUrl + "groups/" + id + "?withMembers=true");
  }
}
