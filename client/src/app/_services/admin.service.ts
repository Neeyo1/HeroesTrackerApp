import { inject, Injectable, signal } from '@angular/core';
import { Group } from '../_models/group';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';
import { Hero } from '../_models/hero';
import { MapArea } from '../_models/mapArea';
import { Map } from '../_models/map';
import { PaginatedResult } from '../_models/pagination';
import { GroupParams } from '../_models/groupParams';
import { MemberWithRoles } from '../_models/memberWithRoles';
import { UserParams } from '../_models/userParams';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  //groups = signal<Group[]>([]);
  heroes = signal<Hero[]>([]);
  mapAreas = signal<MapArea[]>([]);
  maps = signal<Map[]>([]);

  groupCache = new Map();
  singleGroupCache = new Map();
  userCache = new Map();

  paginatedResultGroup = signal<PaginatedResult<Group[]> | null>(null);
  paginatedResultUser = signal<PaginatedResult<MemberWithRoles[]> | null>(null);

  groupParams = signal<GroupParams>(new GroupParams);
  userParams = signal<UserParams>(new UserParams);

  resetGroupParams(){
    this.groupParams.set(new GroupParams);
  }

  resetUserParams(){
    this.userParams.set(new UserParams);
  }

  private setPaginationHeaders(pageNumber: number, pageSize: number){
    let params = new HttpParams();

    if (pageNumber && pageSize){
      params = params.append("pageNumber", pageNumber);
      params = params.append("pageSize", pageSize);
    }

    return params;
  }

  private setPaginatedResponseGroup(response: HttpResponse<Group[]>){
    this.paginatedResultGroup.set({
      items: response.body as Group[],
      pagination: JSON.parse(response.headers.get("pagination")!)
    })
  }

  private setPaginatedResponseUser(response: HttpResponse<MemberWithRoles[]>){
    this.paginatedResultUser.set({
      items: response.body as MemberWithRoles[],
      pagination: JSON.parse(response.headers.get("pagination")!)
    })
  }

  getGroups(){
    const response = this.groupCache.get(Object.values(this.groupParams()).join('-'));

    if (response) return this.setPaginatedResponseGroup(response);
    let params = this.setPaginationHeaders(this.groupParams().pageNumber, this.groupParams().pageSize)

    if (this.groupParams().groupName) params = params.append("groupName", this.groupParams().groupName as string);
    if (this.groupParams().serverName) params = params.append("serverName", this.groupParams().serverName as string);
    if (this.groupParams().owner) params = params.append("owner", this.groupParams().owner as string);
    params = params.append("minMembers", this.groupParams().minMembers);
    params = params.append("maxMembers", this.groupParams().maxMembers);
    params = params.append("orderBy", this.groupParams().orderBy);

    return this.http.get<Group[]>(this.baseUrl + "groups/all", {observe: 'response', params}).subscribe({
      next: response => {
        this.setPaginatedResponseGroup(response);
        this.groupCache.set(Object.values(this.groupParams()).join("-"), response);
      }
    });
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

  deleteGroup(groupId: number){
    return this.http.delete(this.baseUrl + "groups/" + groupId).subscribe({
      next: () => {
        this.groupCache.clear();
        this.getGroups();
      }
    });
  }

  createGroup(model: any){
    return this.http.post<Group>(this.baseUrl + "groups", model).pipe(
      tap(() => {
        this.groupCache.clear();
        this.getGroups();
      })
    );
  }

  editGroup(groupId: number, model: any){
    return this.http.put<Group>(this.baseUrl + `groups/${groupId}`, model).pipe(
      tap(() => {
        this.groupCache.clear();
        this.singleGroupCache.clear();
        this.getGroups();
      })
    );
  }

  getHeroes(){
    return this.http.get<Hero[]>(this.baseUrl + "heroes").subscribe({
      next: heroes => this.heroes.set(heroes)
    });
  }

  deleteHero(heroId: number){
    return this.http.delete(this.baseUrl + "heroes/" + heroId).subscribe({
      next: () => this.heroes.update(x => x.filter(hero => hero.id != heroId))
    });
  }

  deleteHeroes(){
    return this.http.delete(this.baseUrl + "heroes/all").subscribe({
      next: () => this.heroes.set([])
    });
  }

  createHero(model: any){
    return this.http.post<Hero>(this.baseUrl + "heroes", model).pipe(
      tap(hero => this.heroes.update(x => [hero, ...x]))
    )
  }

  editHero(heroId: number, model: any){
    return this.http.put<Hero>(this.baseUrl + "heroes/" + heroId, model).pipe(
      tap(hero => this.heroes.update(x => x.map(h => h.id == heroId ? hero : h)))
    );
  }

  getMapAreas(){
    return this.http.get<MapArea[]>(this.baseUrl + "maps/areas").subscribe({
      next: mapAreas => this.mapAreas.set(mapAreas)
    });
  }

  deleteMapArea(mapAreaId: number){
    return this.http.delete(this.baseUrl + "maps/areas/" + mapAreaId).subscribe({
      next: () => this.mapAreas.update(x => x.filter(mapArea => mapArea.id != mapAreaId))
    });
  }

  deleteMapAreas(){
    return this.http.delete(this.baseUrl + "maps/areas/all").subscribe({
      next: () => this.mapAreas.set([])
    });
  }

  createMapArea(model: any){
    return this.http.post<MapArea>(this.baseUrl + "maps/areas", model).pipe(
      tap(mapArea => this.mapAreas.update(x => [mapArea, ...x]))
    )
  }

  editMapArea(mapAreaId: number, model: any){
    return this.http.put<MapArea>(this.baseUrl + "maps/areas/" + mapAreaId, model).pipe(
      tap(mapArea => this.mapAreas.update(x => x.map(m => m.id == mapAreaId ? mapArea : m)))
    );
  }

  getMaps(){
    return this.http.get<Map[]>(this.baseUrl + "maps").subscribe({
      next: maps => this.maps.set(maps)
    });
  }

  deleteMap(mapId: number){
    return this.http.delete(this.baseUrl + "maps/" + mapId).subscribe({
      next: () => this.maps.update(x => x.filter(map => map.id != mapId))
    });
  }

  deleteMaps(){
    return this.http.delete(this.baseUrl + "maps/all").subscribe({
      next: () => this.maps.set([])
    });
  }

  createMap(model: any){
    return this.http.post<Map>(this.baseUrl + "maps", model).pipe(
      tap(map => this.maps.update(x => [map, ...x]))
    )
  }

  editMap(mapId: number, model: any){
    return this.http.put<Map>(this.baseUrl + "maps/" + mapId, model).pipe(
      tap(map => this.maps.update(x => x.map(m => m.id == mapId ? map : m)))
    );
  }

  getUsers(){
    const response = this.userCache.get(Object.values(this.userParams()).join('-'));

    if (response) return this.setPaginatedResponseUser(response);
    let params = this.setPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize)

    if (this.userParams().knownAs) params = params.append("knownAs", this.userParams().knownAs as string);
    params = params.append("role", this.userParams().role);

    return this.http.get<MemberWithRoles[]>(this.baseUrl + "admin/users", {observe: 'response', params}).subscribe({
      next: response => {
        this.setPaginatedResponseUser(response);
        this.userCache.set(Object.values(this.userParams()).join("-"), response);
      }
    });
  }

  editUser(userId: number, role: string){
    return this.http.post<MemberWithRoles>(this.baseUrl + `admin/edit-roles/${userId}/${role}`, {}).pipe(
      tap(() => {
        this.userCache.clear();
        this.getUsers();
      })
    );
  }

  addTimersForAll(){
    return this.http.post(this.baseUrl + "groups/all/maps/all", {});
  }

  deleteTimersForAll(){
    return this.http.delete(this.baseUrl + "groups/all/maps");
  }

  addTimersForGroup(groupId: number){
    return this.http.post(this.baseUrl + `groups/${groupId}/maps/all`, {});
  }

  deleteTimersForGroup(groupId: number){
    return this.http.delete(this.baseUrl + `groups/${groupId}/maps`);
  }
}
