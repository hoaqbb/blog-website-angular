import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { AvatarModule } from 'primeng/avatar';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, AvatarModule, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [DialogService]
})
export class HeaderComponent {

  constructor(public accountService: AccountService) {}

}
