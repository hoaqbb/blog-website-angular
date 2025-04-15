import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccountService } from '../../../core/services/account.service';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../core/services/post.service';
import { base64ToFile, getFileBlobUrls } from '../../../shared/helpers/post.helper';
import { nanoid } from 'nanoid';
import { CreatePost, PostImage } from '../../../shared/models/post';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-publish-post-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './publish-post-dialog.component.html',
  styleUrl: './publish-post-dialog.component.css'
})
export class PublishPostDialogComponent implements OnInit, OnDestroy {
  data: any;
  model: any = {};

  constructor(
    public accountService: AccountService,
    public postService: PostService,
    public config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.data = config.data;
    this.model.categoryId = 1;
    this.model.status = 1;
  }

  imageFiles: File[] = [];
  selectedImage: string | null = null;
  selectedIndex: any;
  //dictionary to store file names and their corresponding blob URLs
  private fileBlobUrls: { [key: string]: string } = {};
  postImages: PostImage[] = [];

  ngOnInit() {
    this.data.content = this.extractImageAndProcessHtml(this.data.content);

    // Generate all URLs once during initialization
    this.fileBlobUrls = getFileBlobUrls(this.imageFiles);

    // Select first image as default if available
    if (this.imageFiles.length > 0) {
      this.selectThumbnail(this.imageFiles[0], 0);
    }
  }

  ngOnDestroy(): void {
    // Clean up the URL object
    Object.values(this.fileBlobUrls).forEach((url) => URL.revokeObjectURL(url));
  }

  async handleSubmit() {
    try {
      await this.uploadImages(this.imageFiles);

      const processedContent = this.processImagesInContent(
        this.data.content,
        this.postImages
      );

      this.data.content = processedContent;

      this.uploadPost();
    } catch (error) {
      console.error('❌ Error during submission:', error);
    }
  }

  uploadPost() {
    const newPost: CreatePost = {
      title: this.data.title,
      shortDescription: this.data.shortDescription,
      content: this.data.content,
      categoryId: this.model.categoryId,
      status: this.model.status,
      PostImages: this.postImages,
    };

    this.postService.createPost(newPost).subscribe({
      next: (res: any) => {
        this.toastr.success("Create Post successfully!")
        this.ref.destroy();
        this.router.navigateByUrl("blog/" + res.slug);
      },
      error: (error) => {
        this.toastr.success("Error creating post!")
      },
    });
  }

  // Get URL from cache rather than creating new ones
  getBlobUrl(file: File): string {
    if (!this.fileBlobUrls[file.name]) {
      this.fileBlobUrls[file.name] = URL.createObjectURL(file);
    }

    return this.fileBlobUrls[file.name];
  }

  selectThumbnail(file: File, index: number) {
    this.selectedIndex = index;
    this.selectedImage = this.getBlobUrl(file); // Use cached URL
  }

  async uploadImages(files: File[]): Promise<void> {
    const uploadTasks = files.map((file, i) =>
      this.postService.uploadPostImage(file).then((res) => {
        const postImage: PostImage = {
          publicId: res.public_id,
          imageUrl: res.secure_url,
          isThumbnail: this.selectedIndex === i,
        };
        this.postImages.push(postImage);
      })
    );

    await Promise.all(uploadTasks);
  }

  processImagesInContent(htmlContent: string, postImages: PostImage[]) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlContent;

    // Find all img tags in the content
    const imgElements = tempElement.querySelectorAll('img');

    // If no images found, return the original content
    if (imgElements.length === 0) {
      return htmlContent;
    }

    // Process each image element
    Array.from(imgElements).map((img) => {
      const filename = img.getAttribute('data-filename');

      // Skip if data-filename attribute is not set
      if (!filename) {
        return;
      }

      const matchingImage = postImages.find((p) =>
        filename.includes(p.publicId)
      );
      // Skip if no matching image found
      if (matchingImage) {
        try {
          //set src for img tag is imageUrl
          img.setAttribute('src', matchingImage.imageUrl);
          img.removeAttribute('data-filename');
        } catch (error) {
          console.error('❌ Upload thất bại:', error);
        }
      }
    });

    return tempElement.innerHTML;
  }

  // Function to extract image in content and process HTML
  // add attribute data-filename for img tag is file name
  extractImageAndProcessHtml(htmlContent: string): string {
    // Create a temporary DOM element to parse the HTML content
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlContent;

    // Find all img tags in the content
    const imgElements = tempElement.querySelectorAll('img');

    // If no images found, return the original content
    if (imgElements.length === 0) {
      return htmlContent;
    }

    // Process each image element
    Array.from(imgElements).map((img) => {
      const originalSrc = img.getAttribute('src');

      // Skip if no src attribute or already a server URL
      if (!originalSrc || originalSrc.startsWith('http')) {
        return;
      }

      // For data URLs (base64 encoded images)
      if (originalSrc.startsWith('data:image')) {
        try {
          // Convert base64 to file
          const imageFile = base64ToFile(originalSrc, `${nanoid()}.png`);

          //set data-filename for img tag is file name
          img.setAttribute('data-filename', imageFile.name);
          this.imageFiles.push(imageFile);
        } catch (error) {
          console.error('❌ Upload thất bại:', error);
        }
      }
    });

    return tempElement.innerHTML;
  }
}
