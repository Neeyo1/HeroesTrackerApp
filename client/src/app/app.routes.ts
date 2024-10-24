import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { GroupTimersComponent } from './groups/group-timers/group-timers.component';
import { InfoComponent } from './info/info.component';
import { GroupListComponent } from './groups/group-list/group-list.component';
import { authGuard } from './_guards/auth.guard';
import { GroupDetailComponent } from './groups/group-detail/group-detail.component';
import { GroupMembersComponent } from './groups/group-members/group-members.component';
import { unregisteredGuard } from './_guards/unregistered.guard';
import { AdminGroupsComponent } from './admin/admin-groups/admin-groups.component';
import { AdminGroupCreateComponent } from './admin/admin-group-create/admin-group-create.component';
import { AdminHeroesComponent } from './admin/admin-heroes/admin-heroes.component';
import { AdminMapAreasComponent } from './admin/admin-map-areas/admin-map-areas.component';
import { AdminMapsComponent } from './admin/admin-maps/admin-maps.component';
import { AdminHeroCreateComponent } from './admin/admin-hero-create/admin-hero-create.component';
import { AdminMapAreaCreateComponent } from './admin/admin-map-area-create/admin-map-area-create.component';
import { AdminMapCreateComponent } from './admin/admin-map-create/admin-map-create.component';
import { moderatorGuard } from './_guards/moderator.guard';
import { AdminUserListComponent } from './admin/admin-user-list/admin-user-list.component';
import { adminGuard } from './_guards/admin.guard';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { AdminHeroEditComponent } from './admin/admin-hero-edit/admin-hero-edit.component';
import { AdminMapAreaEditComponent } from './admin/admin-map-area-edit/admin-map-area-edit.component';
import { AdminMapEditComponent } from './admin/admin-map-edit/admin-map-edit.component';
import { AdminGroupEditComponent } from './admin/admin-group-edit/admin-group-edit.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            {path: 'groups', component: GroupListComponent},
            {path: 'groups/:id', component: GroupDetailComponent},
            {path: 'groups/:id/timers', component: GroupTimersComponent},
            {path: 'groups/:id/members', component: GroupMembersComponent},
            {path: 'profile/edit', component: ProfileEditComponent},
            {path: 'profile/change-password', component: ChangePasswordComponent},
        ]
    },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard, moderatorGuard],
        children: [
            {path: 'admin/groups', component: AdminGroupsComponent},
            {path: 'admin/group/create', component: AdminGroupCreateComponent},
            {path: 'admin/group/:id/edit', component: AdminGroupEditComponent, canActivate: [adminGuard]},
            {path: 'admin/event/heroes', component: AdminHeroesComponent},
            {path: 'admin/event/map-areas', component: AdminMapAreasComponent},
            {path: 'admin/event/maps', component: AdminMapsComponent},
            {path: 'admin/event/heroes/create', component: AdminHeroCreateComponent},
            {path: 'admin/event/map-areas/create', component: AdminMapAreaCreateComponent},
            {path: 'admin/event/maps/create', component: AdminMapCreateComponent},
            {path: 'admin/event/heroes/:id/edit', component: AdminHeroEditComponent},
            {path: 'admin/event/map-areas/:id/edit', component: AdminMapAreaEditComponent},
            {path: 'admin/event/maps/:id/edit', component: AdminMapEditComponent},
            {path: 'admin/users', component: AdminUserListComponent, canActivate: [adminGuard]},
        ]
    },
    {path: 'register', component: RegisterComponent, canActivate: [unregisteredGuard]},
    {path: 'info', component: InfoComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'},
];
