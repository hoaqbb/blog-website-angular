import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { AccountService } from '../../../core/services/account.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  googleClientId = environment.googleClientId;
  model: any = {};
  validationErrors: string[] = [];

  constructor(private acountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.initializeGoogleBtn();
  }

  login() {
    this.acountService.login(this.model).subscribe(
      {
        next: response => {
          console.log(response);
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          console.log(error);
          this.validationErrors.push(error);
        }
      }
    );
    
  }

  initializeGoogleBtn() {
    google.accounts.id.initialize({
      client_id: this.googleClientId,
      callback: (res: any) => {
        this.acountService.signInWithGoogle(res.credential).subscribe(
          {
            next: response => {
              this.router.navigateByUrl('/');
            },
            error: (error) => {
              console.log(error);
              this.validationErrors.push(error);
            }
          }
        );
      }
    });

    google.accounts.id.renderButton(
      document.getElementById('google-btn'), {
        size: 'large',
        shape: 'pill',
        text: "signin_with"
      })
  }
}
