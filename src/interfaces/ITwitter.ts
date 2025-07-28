export interface CreateTweetData {
  content: string;
  authorId: number;
}

export interface CreateReplyData {
  content: string;
  authorId: number;
  parentId: number;
}

export interface TweetResponse {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    username: string;
  };
  createdAt: Date;
  likes: number;
  replies: number;
}

export interface ReplyResponse extends TweetResponse {
  replyingTo: {
    id: number;
    content: string;
    author: {
      id: number;
      name: string;
      username: string;
    };
  };
}

export interface FeedTweet extends TweetResponse {
  isLikedByUser: boolean;
  recentReplies: Array<{
    id: number;
    content: string;
    createdAt: Date;
    author: {
      id: number;
      name: string;
      username: string;
    };
  }>;
}

export interface FeedResponse {
  tweets: FeedTweet[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}