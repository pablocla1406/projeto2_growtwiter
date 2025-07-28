export interface UserResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  createdAt: Date;
}


export interface CreateUserData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface UserWithDetails {
  id: number;
  name: string;
  username: string;
  email: string;
  createdAt: Date;
  tweets: Array<{
    id: number;
    content: string;
    createdAt: Date;
    _count: {
      likes: number;
      replies: number;
    };
  }>;
  followers: Array<{
    id: number;
    name: string;
    username: string;
  }>;
  following: Array<{
    id: number;
    name: string;
    username: string;
  }>;
  _count: {
    tweets: number;
    followers: number;
    following: number;
  };
}