import { authApi } from "../auth-api";
import type { RatingResponse } from "./models";

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  // 생략하면 서버에 null로 저장돼요.
  comment?: string;
}

export function updateRating({ ratingId, ...body }: UpdateRatingRequest) {
  return authApi.patch(`ratings/${ratingId}`, { json: body }).json<RatingResponse>();
}
