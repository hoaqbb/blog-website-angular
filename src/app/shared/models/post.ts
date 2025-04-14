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