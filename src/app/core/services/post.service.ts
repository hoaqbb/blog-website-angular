import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Category } from '../../shared/models/category';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  categories = signal<Category[] | null>(null);

  getPostBySlug(slug: string) {
    return this.http.get(this.baseUrl + '/api/Posts/' + slug);
  }

  getAllCategory() {
    return this.http.get(this.baseUrl + '/api/Categories');
  }
}
