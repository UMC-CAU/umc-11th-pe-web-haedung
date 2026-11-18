import { useQuery } from "@tanstack/react-query";
import { getMemberRatings } from "../api/ratings/get-member-ratings";
import { useMeQuery } from "./use-me-query";

export function getMemberRatingsQueryKey(memberId: number | undefined) {
  return ["members", memberId, "ratings"] as const;
}

// 내 정보 조회로 memberId를 얻은 뒤 내 평점 목록을 조회해요.
export function useMyRatingsQuery() {
  const { data: me } = useMeQuery();
  const memberId = me?.memberId;

  const ratingsQuery = useQuery({
    queryKey: getMemberRatingsQueryKey(memberId),
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== undefined,
  });

  return { memberId, ratingsQuery };
}
