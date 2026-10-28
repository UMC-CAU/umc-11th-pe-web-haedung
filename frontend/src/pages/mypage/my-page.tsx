import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { useAuth } from "../../auth/auth-context";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useBookmarkStore } from "../../stores/bookmark-store";
import "./my-page.css";

const MOVIES_PER_PAGE = 10;

export function MyPage() {
  const { profile } = useAuth();
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);

  const [bookmarkedMovies, setBookmarkedMovies] = useState<TmdbMovieDetail[]>([]);

  useEffect(() => {
    let ignore = false;

    // 북마크된 id마다 상세 정보를 받아오고, 실패한 id(예: 예전 로컬 데이터 id)는 건너뛴다
    Promise.allSettled(bookmarkedMovieIds.map((movieId) => getMovieDetail(movieId))).then(
      (results) => {
        if (ignore) return;
        setBookmarkedMovies(
          results.flatMap((result) => (result.status === "fulfilled" ? [result.value] : [])),
        );
      },
    );

    return () => {
      ignore = true;
    };
  }, [bookmarkedMovieIds]);
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
            <dd>{profile.nickname}</dd>
          </dl>
          <dl className="mypage-profile-item">
            <dt>이메일</dt>
            <dd>{profile.email}</dd>
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
