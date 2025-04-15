import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./features/layout/header/header.component";
import { FooterComponent } from "./features/layout/footer/footer.component";
import { AccountService } from './core/services/account.service';
import { User } from './shared/models/user';
import { PostService } from './core/services/post.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private accountService: AccountService, private postService: PostService) { }
  
  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));

    if(user) {
      this.accountService.currentUser.set(user);
      this.getCategories();
    }
  }

  getCategories() {
    this.postService.getAllCategory().subscribe({
      next: (data: any) => {
        this.postService.categories.set(data);
        console.log(this.postService.categories());
        
      },
      error: (error) => console.error(error)
    })
  }
}
