import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/account/login/login.component';
import { RegisterComponent } from './features/account/register/register.component';
import { PostDetailsComponent } from './features/blog/post-details/post-details.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'blog/:slug', component: PostDetailsComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: '**', redirectTo:'',  pathMatch: 'full'}
];
