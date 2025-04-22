import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CreatePost } from '../../shared/models/post';
import { Category } from '../../shared/models/category';
import { PostParams } from '../../shared/models/postParams';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  baseUrl = environment.apiUrl;
  cloudName = environment.CloudinarySettings.cloudName;
  uploadUrl = environment.CloudinarySettings.uploadUrl;
  uploadPreset = environment.CloudinarySettings.uploadPreset;

  constructor(private http: HttpClient) { }

  newPost = signal<CreatePost | null>(null);
  categories = signal<Category[] | null>(null);

  isNewPostValid(): boolean {
    if (this.newPost() == null || this.newPost().title == null || this.newPost().content == null) {
      return false;
    }
    return true;
  }

  getPostsByCategory(postParams: PostParams) {
    let params = new HttpParams();
    params = params.append('category', postParams.category);
    params = params.append('pageIndex', postParams.pageIndex);

    return this.http.get(this.baseUrl + '/api/Posts/category', { params });
  }

  getPostBySlug(slug: string) {
    return this.http.get(this.baseUrl + '/api/Posts/' + slug)
  }
  
  createPost(post: CreatePost) {
    return this.http.post(this.baseUrl + '/api/Posts', post)
  }

  getAllCategory() {
    return this.http.get<Category[]>(this.baseUrl + '/api/Categories')
    .pipe(
      tap((cats: Category[]) => {
        this.categories.set(cats);
      })
    )
  }

  // use fetch to ignore the interceptor
  async uploadPostImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", this.uploadPreset);
  
    const response = await fetch(this.uploadUrl + this.cloudName + '/image/upload', {
      method: 'POST',
      body: formData,
    })

    if(!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data;
  }

  commentPost(postId, content) {
    return this.http.post(this.baseUrl + '/api/Comments', { postId: postId, content: content });
  }

  getReplyComments(commentId) {
    return this.http.get(this.baseUrl + '/api/Comments/' + commentId + '/replies');
  }
}
