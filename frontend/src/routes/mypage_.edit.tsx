import { createFileRoute } from "@tanstack/react-router";
import { MyPageEdit } from "../pages/mypage/my-page-edit";

export const Route = createFileRoute("/mypage_/edit")({
  component: MyPageEdit,
});
