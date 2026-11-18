import { useQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { useAuth } from "../../auth/auth-context";
import { useFavoritesQuery } from "../../hooks/use-favorites-query";
import { useMeQuery } from "../../hooks/use-me-query";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import "./my-page.css";

const MOVIES_PER_PAGE = 10;

export function MyPage() {
  const { profile } = useAuth();
  const { data: me } = useMeQuery();
  const { data: favorites = [] } = useFavoritesQuery();

  // 서버는 movieId만 주므로 포스터·제목은 TMDB 상세로 받아요.
  // 상세 페이지와 같은 queryKey라서 이미 본 영화는 캐시를 그대로 써요.
  const movieDetailQueries = useQueries({
    queries: favorites.map((favorite) => ({
      queryKey: ["movies", "detail", favorite.movieId],
      queryFn: () => getMovieDetail(favorite.movieId),
    })),
  });
  // 상세 조회에 실패한 영화는 건너뛴다
  const bookmarkedMovies = movieDetailQueries.flatMap((query) => (query.data ? [query.data] : []));

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(bookmarkedMovies.length / MOVIES_PER_PAGE));
  // 즐겨찾기를 해제해 마지막 페이지가 사라지면 남아 있는 마지막 페이지를 보여준다
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleMovies = bookmarkedMovies.slice(
    (safeCurrentPage - 1) * MOVIES_PER_PAGE,
    safeCurrentPage * MOVIES_PER_PAGE,
  );

  return (
    <main className="mypage">
      <div className="mypage-header">
        <h1 className="mypage-title">내 정보</h1>
        <Link to="/mypage/edit" className="mypage-edit-button">
          정보 수정
        </Link>
      </div>

      <section className="mypage-section">
        <h2 className="mypage-section-title">기본 정보</h2>
        <div className="mypage-profile">
          <div className="mypage-avatar">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt="프로필 이미지" className="mypage-avatar-photo" />
            ) : (
              <img src="/icons/person.svg" alt="" />
            )}
          </div>
          <dl className="mypage-profile-item">
            <dt>닉네임</dt>
            <dd>{me?.nickname}</dd>
          </dl>
          <dl className="mypage-profile-item">
            <dt>이메일</dt>
            <dd>{me?.email}</dd>
          </dl>
        </div>
      </section>

      <section className="mypage-section">
        <h2 className="mypage-section-title">내 즐겨찾기</h2>
        {bookmarkedMovies.length === 0 ? (
          <p className="mypage-empty">아직 즐겨찾기한 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid movies={visibleMovies} />
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </section>
    </main>
  );
}
