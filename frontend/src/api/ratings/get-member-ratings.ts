import { apiClient } from "../api-client";
import type { Rating } from "./models";

// 공통 응답 형식이 아니라 평점 배열을 그대로 응답해요. 토큰이 필요 없어요.
export function getMemberRatings(memberId: number) {
  return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}
