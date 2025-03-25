import { Component, OnInit } from '@angular/core';
import { ExternalAuth } from '../../../shared/models/externalAuth';
import { environment } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../../core/services/account.service';
import { Router, RouterLink } from '@angular/router';
declare var google: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  googleClientId = environment.googleClientId;
  registerForm!: FormGroup;
  validationErrors: string[] = [];

  constructor(
    private acountService: AccountService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeRegisterForm();
    this.initializeGoogleBtn();
  }

  initializeRegisterForm() {
    this.registerForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  initializeGoogleBtn() {
    google.accounts.id.initialize({
      client_id: this.googleClientId,
      callback: (res: any) => {
        this.acountService.signInWithGoogle(res.credential).subscribe();
      },
    });

    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      size: 'large',
      shape: 'pill',
      text: 'signup_with',
    });
  }

  register() {
    if (this.registerForm.valid) {
      console.log(this.registerForm);
      this.acountService.register(this.registerForm.value).subscribe({
        next: (res: any) => {
          this.router.navigateByUrl('/');
        },
        error: (err: any) => this.validationErrors.push(err)
      });
    }
  }
}
