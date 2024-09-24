import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Group } from '../_models/group';
import { AccountService } from './account.service';
import { GroupMember } from '../_models/groupMember';
import { of, tap } from 'rxjs';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  groups = signal<Group[]>([]);
  groupCache = new Map<string, Group>();

  getGroups(){
    return this.http.get<Group[]>(this.baseUrl + "groups").subscribe({
      next: groups => this.groups.set(groups)
    });
  }

  getGroup(id: number){
    const group = this.groups().find(x => x.id == id);
    if (group != undefined) return of(group);

    const groupFromCache = this.groupCache.get(`group-${id}`);
    if (groupFromCache != undefined) return of(groupFromCache);
    
    return this.http.get<Group>(this.baseUrl + "groups/" + id + "?withMembers=true").pipe(
      tap(groupFromApi => {
        this.groupCache.set(`group-${groupFromApi.id}`, groupFromApi);
      }
    ));
  }

  addOrRemoveMember(username: string, groupId: number){
    return this.http.put<Member | null>(this.baseUrl + `groups/members/${groupId}?userToEditUsername=${username}`, {});
  }

  addOrRemoveModerator(username: string, groupId: number, isModerator: boolean){
    return this.http.put(this.baseUrl + `groups/moderators/${groupId}?userToEditUsername=${username}&mod=${isModerator}`, {});
  }
}
