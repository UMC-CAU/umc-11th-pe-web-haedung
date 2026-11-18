export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export interface FavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Favorite;
}

export interface FavoriteListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Favorite[];
}
