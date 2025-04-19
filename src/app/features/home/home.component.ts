import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AccountService } from '../../core/services/account.service';
import { CommonModule } from '@angular/common';
import { PostService } from '../../core/services/post.service';
import { PostList } from '../../shared/models/post';
import { PostItemComponent } from '../blog/post-item/post-item.component';
import { PostParams } from '../../shared/models/postParams';
import { Pagination } from '../../shared/models/pagination';
import { RouterLink } from '@angular/router';
import { debounceTime, filter, fromEvent, map } from 'rxjs';
import { Category } from '../../shared/models/category';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PostItemComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  posts: PostList[] = [];
  postParams = new PostParams();
  categoryListForSelection: any[] = [];
  hasMorePost = true;

  constructor(
    public accountService: AccountService,
    public postService: PostService
  ) {
    this.initCategoryData();
  }

  ngAfterViewInit(): void {
    this.getData(); // đảm bảo DOM sau khi dữ liệu render
  }

  ngOnInit(): void {
  }

  initCategoryData() {
    if (this.accountService.currentUser()) {
      let processed = false;
      effect(() => {
        const cats = this.postService.categories();
        if (!processed && cats) {
          this.processCategories(cats);
          this.getPostsByCategory();
          processed = true;
        }
      });
    }
  }
  
  // Process list categories by adding selected property
  processCategories(categories: Category[]) {
    // Create a category name For you and select it by default
    const forYouObj = {
      id: null,
      name: 'For you',
      slug: '',
      isSelected: true,
    };
    this.categoryListForSelection.push(forYouObj);

    // Add isSelected property to each category
    this.categoryListForSelection = this.categoryListForSelection.concat(
      categories.map((obj) => ({ ...obj, isSelected: false }))
    );
  }

  selectCategory(index: number) {
    // Get the index that was previously selected
    const selectedIndex = this.categoryListForSelection.findIndex(
      (cat) => cat.isSelected == true
    );

    // if the previously index equals to the current index, then do nothing
    if (selectedIndex == index) return;
    else {
      this.categoryListForSelection.forEach((cat) => (cat.isSelected = false));

      const selectedCategory = this.categoryListForSelection[index];
      selectedCategory.isSelected = true;

      // Reset state
      this.postParams.pageIndex = 1;
      this.postParams.category = selectedCategory.slug;
      this.posts = [];
      this.hasMorePost = true;

      // Scroll to top of container
      if (this.scrollContainer?.nativeElement) {
        this.scrollContainer.nativeElement.scrollTop = 0;
      }
      this.getPostsByCategory();
    }
  }

  // Get more data when scroll near to the end of the container
  getData() {
    if (!this.scrollContainer) return;

    fromEvent(this.scrollContainer.nativeElement, 'scroll')
      .pipe(
        debounceTime(100),
        map(() => {
          const el = this.scrollContainer.nativeElement;
          // calculate the scroll position
          return el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
        }),
        filter((nearBottom) => nearBottom && this.hasMorePost)
      )
      .subscribe(() => {
        this.postParams.pageIndex++;
        this.getPostsByCategory();
      });
  }

  getPostsByCategory() {
    this.postService.getPostsByCategory(this.postParams).subscribe({
      next: (data: any) => {
        // stop call api when page index >= total pages
        if (this.postParams.pageIndex >= data.totalPages)
          this.hasMorePost = false;
        this.posts = [...this.posts, ...data.data];
      },
      error: (error) => console.error(error),
    });
  }
}
