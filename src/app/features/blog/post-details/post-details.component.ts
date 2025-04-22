import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillViewHTMLComponent } from 'ngx-quill';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { PostService } from '../../../core/services/post.service';
import { replaceNbspWithSpace } from '../../../shared/helpers/post.helper';
import { ActivatedRoute } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { PostDetails } from '../../../shared/models/post';
import { LikeService } from '../../../core/services/like.service';
import { ToastrService } from 'ngx-toastr';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AccountService } from '../../../core/services/account.service';
import { Comment } from '../../../shared/models/comment';

@Component({
  selector: 'app-post-details',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    QuillViewHTMLComponent,
    AvatarModule,
    InputTextareaModule,
    ReactiveFormsModule,
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit {
  post: PostDetails;
  slug: string | null = null;
  replyForms: { [commentId: number]: FormGroup } = {};
  activeReplyCommentId: number | null = null;

  constructor(
    private postService: PostService,
    private likeService: LikeService,
    public accountService: AccountService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get('slug');
      this.postService
        .getPostBySlug(this.slug)
        .subscribe((res: PostDetails) => {
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

  likeComment(comment: Comment) {
    this.likeService.likeComment(comment.id).subscribe({
      next: () => {
        // Update comment like count and isLikedByCurrentUser
        comment.isLikedByCurrentUser = true;
        comment.likeCount++;
      },
      error: (error) => {
        this.toastr.error(error.error);
      },
    });
  }

  unlikeComment(comment: Comment) {
    this.likeService.unlikeComment(comment.id).subscribe({
      next: () => {
        // Update comment like count and isLikedByCurrentUser
        comment.isLikedByCurrentUser = false;
        comment.likeCount--;
      },
      error: (error) => {
        this.toastr.error(error.error);
      },
    });
  }

  addComment(postId: string, myForm: NgForm) {
    let content = myForm.value.content;
    if (!content) return;

    this.postService.commentPost(postId, content).subscribe({
      next: (res: any) => {
        this.post.postComments.unshift(res);
        this.post.commentCount++;
        myForm.reset();
      },
      error: (err) => {
        err.errors.forEach((err) => {
          this.toastr.error(err);
        });
      },
    });
  }

  loadReplyComments(comment: Comment) {
    this.postService.getReplyComments(comment.id).subscribe({
      next: (res: any) => {
        comment.replyComments = res;
      },
      error: (err) => {
        this.toastr.error('Failed to load reply comments.');
      },
    });
  }

  initReplyForm(commentId: number) {
    if (!this.replyForms[commentId]) {
      this.replyForms[commentId] = this.fb.group({
        content: [''],
      });
    }
    this.activeReplyCommentId = commentId;
  }

  replyComment(commentId: number) {
    const form = this.replyForms[commentId];
    if (form.valid) {
      const content = form.value.content;
      this.postService
        .replyComment(this.post.id, commentId, content)
        .subscribe({
          next: (res: any) => {
            let comment = this.post.postComments.find((c) => c.id == commentId);
            if (comment) {
              comment.replyComments.unshift(res);
              this.post.commentCount++;
              form.reset();
              this.activeReplyCommentId = null;
            }
          },
          error: (err) => {
            this.toastr.error("Falied to reply comment!");
          },
        });
    }
  }

  cancelReply() {
    this.activeReplyCommentId = null;
  }
}
