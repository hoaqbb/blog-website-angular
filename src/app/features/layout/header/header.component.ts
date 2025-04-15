import { Component, OnInit, signal } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { AvatarModule } from 'primeng/avatar';
import { filter } from 'rxjs';
import { PublishPostDialogComponent } from '../../blog/publish-post-dialog/publish-post-dialog.component';
import { PostService } from '../../../core/services/post.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, AvatarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [DialogService],
})
export class HeaderComponent implements OnInit {
  isBloging = signal<boolean>(false);

  ref: DynamicDialogRef | undefined;

  constructor(
    public accountService: AccountService,
    public postService: PostService,
    private router: Router,
    public dialogService: DialogService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isBloging.set(event.urlAfterRedirects === '/write-blog');
      });
  }

  showPublishDialog() {
    if (!this.postService.isNewPostValid()) {
      this.toastr.error("Please fill in all required fields before publishing.");
      return;
    } else {
      this.ref = this.dialogService.open(PublishPostDialogComponent, {
        data: this.postService.newPost(),
        width: '60vw',
        modal: true,
        breakpoints: {
          '960px': '75vw',
          '640px': '90vw',
        },
      });
    }
  }

  logout() {
    this.accountService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
