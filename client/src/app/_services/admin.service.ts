import { inject, Injectable, signal } from '@angular/core';
import { Group } from '../_models/group';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';
import { Hero } from '../_models/hero';
import { MapArea } from '../_models/mapArea';
import { Map } from '../_models/map';
import { PaginatedResult } from '../_models/pagination';
import { GroupParams } from '../_models/groupParams';

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
  paginatedResult = signal<PaginatedResult<Group[]> | null>(null);
  groupParams = signal<GroupParams>(new GroupParams);

  resetGroupParams(){
    this.groupParams.set(new GroupParams);
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

    return this.http.get<Group[]>(this.baseUrl + "groups/all", {observe: 'response', params}).subscribe({
      next: response => {
        this.setPaginatedResponse(response);
        this.groupCache.set(Object.values(this.groupParams()).join("-"), response);
      }
    });
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

  createHero(model: any){
    return this.http.post<Hero>(this.baseUrl + "heroes", model).pipe(
      tap(hero => this.heroes.update(x => [hero, ...x]))
    )
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

  createMapArea(model: any){
    return this.http.post<MapArea>(this.baseUrl + "maps/areas", model).pipe(
      tap(mapArea => this.mapAreas.update(x => [mapArea, ...x]))
    )
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

  createMap(model: any){
    return this.http.post<Map>(this.baseUrl + "maps", model).pipe(
      tap(map => this.maps.update(x => [map, ...x]))
    )
  }
}
