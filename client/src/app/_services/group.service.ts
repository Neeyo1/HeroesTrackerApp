import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Group } from '../_models/group';
import { AccountService } from './account.service';
import { GroupMember } from '../_models/groupMember';
import { of, tap } from 'rxjs';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { GroupParams } from '../_models/groupParams';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  //groups = signal<Group[]>([]);
  groupCache = new Map();
  singleGroupCache = new Map();
  paginatedResult = signal<PaginatedResult<Group[]> | null>(null);
  groupParams = signal<GroupParams>(new GroupParams);

  resetGroupParams(){
    this.groupParams.set(new GroupParams);
  }

  getGroups(){
    const response = this.groupCache.get(Object.values(this.groupParams()).join('-'));

    if (response) return this.setPaginatedResponse(response);
    let params = this.setPaginationHeaders(this.groupParams().pageNumber, this.groupParams().pageSize)

    if (this.groupParams().groupName) params = params.append("groupName", this.groupParams().groupName as string);
    if (this.groupParams().serverName) params = params.append("serverName", this.groupParams().serverName as string);
    if (this.groupParams().owner) params = params.append("owner", this.groupParams().owner as string);
    params = params.append("minMembers", this.groupParams().minMembers);
    params = params.append("maxMembers", this.groupParams().maxMembers);
    params = params.append("orderBy", this.groupParams().orderBy);

    return this.http.get<Group[]>(this.baseUrl + "groups", {observe: 'response', params}).subscribe({
      next: response => {
        this.setPaginatedResponse(response);
        this.groupCache.set(Object.values(this.groupParams()).join("-"), response);
      }
    });
  }

  private setPaginationHeaders(pageNumber: number, pageSize: number){
    let params = new HttpParams();

    if (pageNumber && pageSize){
      params = params.append("pageNumber", pageNumber);
      params = params.append("pageSize", pageSize);
    }

    return params;
  }

  private setPaginatedResponse(response: HttpResponse<Group[]>){
    this.paginatedResult.set({
      items: response.body as Group[],
      pagination: JSON.parse(response.headers.get("pagination")!)
    })
  }

  getGroup(id: number){
    const group: Group = [...this.groupCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((g: Group) => g.id == id);

    if (group) return of(group);

    const groupFromSingleCache = this.singleGroupCache.get(`group-${id}`);
    if (groupFromSingleCache) return of(groupFromSingleCache);
    
    return this.http.get<Group>(this.baseUrl + "groups/" + id + "?withMembers=true").pipe(
      tap(groupFromApi => {
        this.singleGroupCache.set(`group-${groupFromApi.id}`, groupFromApi);
      }
    ));
  }

  addOrRemoveMember(userKnowAs: string, groupId: number){
    return this.http.put<Member | null>(this.baseUrl + `groups/members/${groupId}?userToEditKnownAs=${userKnowAs}`, {});
  }

  addOrRemoveModerator(userId: number, groupId: number, isModerator: boolean){
    return this.http.put(this.baseUrl + `groups/moderators/${groupId}?userToEditId=${userId}&mod=${isModerator}`, {});
  }
}
