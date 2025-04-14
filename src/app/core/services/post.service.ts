import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPostBySlug(slug: string) {
    return this.http.get(this.baseUrl + '/api/Posts/' + slug)
  }
}