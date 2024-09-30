import { inject, Injectable, signal } from '@angular/core';
import { Group } from '../_models/group';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Hero } from '../_models/hero';
import { MapArea } from '../_models/mapArea';
import { Map } from '../_models/map';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  groups = signal<Group[]>([]);
  heroes = signal<Hero[]>([]);
  mapAreas = signal<MapArea[]>([]);
  maps = signal<Map[]>([]);

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
