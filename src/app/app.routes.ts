import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/account/login/login.component';
import { RegisterComponent } from './features/account/register/register.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    // {path: '', component: LoginComponent},
    {path: '**', redirectTo:'',  pathMatch: 'full'}
];
