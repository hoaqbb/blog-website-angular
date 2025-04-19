import { Component, Input } from '@angular/core';
import { PostList } from '../../../shared/models/post';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LikeService } from '../../../core/services/like.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './post-item.component.html',
  styleUrl: './post-item.component.css',
})
export class PostItemComponent {
  @Input() post: PostList;

  constructor(private likeService: LikeService, private toastr: ToastrService) {}

  likePost(postId) {
    this.likeService.likePost(postId).subscribe({
      next: () => {
        this.post.isLikedByCurrentUser = true;
        this.post.likeCount++;
      },
      error: (error) => {
        this.toastr.error(error.error);
      },
    });
  }

  unlikePost(postId) {
    this.likeService.unlikePost(postId).subscribe({
      next: () => {
        this.post.isLikedByCurrentUser = false;
        this.post.likeCount--;
      },
      error: (error) => {
        this.toastr.error(error.error);
      },
    });
  }
}
