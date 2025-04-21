import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillViewHTMLComponent } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../core/services/post.service';
import { replaceNbspWithSpace } from '../../../shared/helpers/post.helper';
import { ActivatedRoute } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { PostDetails } from '../../../shared/models/post';
import { LikeService } from '../../../core/services/like.service';
import { ToastrService } from 'ngx-toastr';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'app-post-details',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, QuillViewHTMLComponent, AvatarModule, InputTextareaModule],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit {
  post: PostDetails;
  slug: string | null = null;
  model: any = {}

  constructor(
    private postService: PostService,
    private likeService: LikeService,
    public accountService: AccountService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get('slug');
      this.postService.getPostBySlug(this.slug).subscribe((res: PostDetails) => {
        this.post = res;
        this.post.content = replaceNbspWithSpace(this.post.content);
      });
    });
  }

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

  likeComment(commentId) {
    this.likeService.likeComment(commentId).subscribe({
      next: () => {
        // Update comment like count and isLikedByCurrentUser
        let comment = this.post.postComments.find(x => x.id == commentId);
        comment.isLikedByCurrentUser = true;
        comment.likeCount++;
      },
      error: (error) => {
        this.toastr.error(error.error);
      },
    });
  }

  unlikeComment(commentId) {
    this.likeService.unlikeComment(commentId).subscribe({
      next: () => {
        // Update comment like count and isLikedByCurrentUser
        let comment = this.post.postComments.find(x => x.id == commentId);
        comment.isLikedByCurrentUser = false;
        comment.likeCount--;
      },
      error: (error) => {
        this.toastr.error(error.error);
      },
    });
  }

  addComment(postId: string, content: string) {
    if(!content) return;

    this.postService.commentPost(postId, content).subscribe({
      next: (res: any) => {
        this.post.postComments.unshift(res);
        this.post.commentCount++;
        this.model.content = '';
      }, error: (err) => {
        err.errors.forEach(err => {
          console.log("ok");
          
          this.toastr.error(err);
        });
        
        }
    });
  
  }
}
