import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { GroupTimersComponent } from './groups/group-timers/group-timers.component';
import { InfoComponent } from './info/info.component';
import { GroupListComponent } from './groups/group-list/group-list.component';
import { authGuard } from './_guards/auth.guard';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            {path: 'groups', component: GroupListComponent},
            {path: 'group/:id', component: GroupTimersComponent},
        ]
    },
    {path: 'register', component: RegisterComponent},
    {path: 'info', component: InfoComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'},
];
