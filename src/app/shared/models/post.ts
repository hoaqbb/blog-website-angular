import { Author } from "./user"
import { Comment } from "./comment"

  export interface PostDetails {
    id: string
    title: string
    shortDescription: string
    slug: string
    content: string
    view: number
    createAt: string
    updateAt: string
    thumbnail: string
    author: Author
    likeCount: number
    commentCount: number
    isLikedByCurrentUser: boolean
    postComments: Comment[]
  }

  export interface CreatePost {
    title: string
    shortDescription: string
    content: string
    categoryId: number
    status: PostStatus
    PostImages: PostImage[]
  }

  export interface PostImage {
    publicId: string
    imageUrl: string
    isThumbnail: boolean
  }

  export enum PostStatus {
    Ban = 0,
    Public = 1,
    Archive = 2
  }