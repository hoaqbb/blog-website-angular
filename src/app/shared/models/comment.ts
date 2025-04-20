import { Author } from "./user"

export interface Comment {
  id: number
  content: string
  createAt: string
  author: Author
  replyCommentCount: number
  likeCount: number
  isLikedByCurrentUser: boolean
}