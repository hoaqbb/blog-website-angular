import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  likePost(postId) {
    return this.http.post(this.baseUrl + '/api/Likes/post/' + postId, {});
  }

  unlikePost(postId) {
    return this.http.delete(this.baseUrl + '/api/Likes/post/' + postId, {});
  }
}
