import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

export const Route = createFileRoute("/(protected)")({
  // 토큰이 없으면 페이지를 표시하기 전에 로그인 페이지로 이동
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: Outlet,
});
