import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillViewHTMLComponent } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../core/services/post.service';
import { replaceNbspWithSpace } from '../../../shared/helpers/post.helper';
import { ActivatedRoute } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { PostDetails } from '../../../shared/models/post';

@Component({
  selector: 'app-post-details',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, QuillViewHTMLComponent, AvatarModule],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit {
  post: PostDetails;;
  slug: string | null = null;

  constructor(
    private postService: PostService,
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
}
