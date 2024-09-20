import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Group } from '../_models/group';
import { AccountService } from './account.service';
import { GroupMember } from '../_models/groupMember';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  getGroups(){
    return this.http.get<Group[]>(this.baseUrl + "groups");
  }

  getGroup(id: number){
    return this.http.get<Group>(this.baseUrl + "groups/" + id);
  }

  getGroupMembers(id: number){
    return this.http.get<GroupMember[]>(this.baseUrl + "groups/members/" + id);
  }
}
