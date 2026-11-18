import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../api/ratings/create-rating";
import { deleteRating } from "../api/ratings/delete-rating";
import type { Rating } from "../api/ratings/models";
import { updateRating } from "../api/ratings/update-rating";
import { getMemberRatingsQueryKey } from "./use-my-ratings-query";

// 등록·수정 응답에 최신 평점이 담겨 오므로 다시 조회하지 않고 캐시를 직접 바꿔요.
export function useCreateRatingMutation(memberId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRating,
    onSuccess: (response) => {
      queryClient.setQueryData<Rating[]>(getMemberRatingsQueryKey(memberId), (prev = []) => [
        ...prev,
        response.result,
      ]);
      alert(response.message);
    },
    onError: () => {
      alert("평점 등록에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useUpdateRatingMutation(memberId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRating,
    onSuccess: (response) => {
      queryClient.setQueryData<Rating[]>(getMemberRatingsQueryKey(memberId), (prev = []) =>
        prev.map((rating) =>
          rating.ratingId === response.result.ratingId ? response.result : rating,
        ),
      );
      alert(response.message);
    },
    onError: () => {
      alert("평점 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

// 삭제 응답의 result는 null이라, 요청에 보낸 ratingId로 캐시에서 빼요.
export function useDeleteRatingMutation(memberId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRating,
    onSuccess: (response, ratingId) => {
      queryClient.setQueryData<Rating[]>(getMemberRatingsQueryKey(memberId), (prev = []) =>
        prev.filter((rating) => rating.ratingId !== ratingId),
      );
      alert(response.message);
    },
    onError: () => {
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
