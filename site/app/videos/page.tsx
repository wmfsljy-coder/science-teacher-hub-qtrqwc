import type { Metadata } from "next";
import VideoShelf from "@/components/VideoShelf";
import { getVideos } from "@/lib/content";
import { btnSecondary } from "@/lib/ui";

export const metadata: Metadata = {
  title: "영상 모음",
  description: "유튜브 「교실 너머 과학」 짧은 정리 영상을 새것부터 모은 곳 · 누르면 크게 틀고, 이름표로 단원 이동",
};

const CHANNEL = "https://www.youtube.com/@%EA%B5%90%EC%8B%A4%EB%84%88%EB%A8%B8%EA%B3%BC%ED%95%99";

/* 상단 메뉴 '▶️ 영상 모음'(칠판모드 옆). 허브 data/videos.json 을 fetch-content 가 새것부터 정리한 목록을 보여 줍니다.
 * 새 영상은 data/videos.json 에 한 줄 더하면 다음 빌드 때 여기에도 저절로 붙습니다. */
export default function VideosPage() {
  const videos = getVideos();
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-teal-700 dark:text-teal-300">유튜브 「교실 너머 과학」 · 짧은 정리 영상</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">▶️ 영상 모음</h1>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            영상 {videos.length}편, 새것부터. 그림을 누르면 이 화면에서 크게 틀고, 아래 과목 이름표를 누르면 그 단원으로 갑니다.
          </p>
        </div>
        <a href={CHANNEL} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
          채널 전체 보기 ↗
        </a>
      </section>
      {videos.length ? (
        <VideoShelf videos={videos} />
      ) : (
        <p className="text-lg text-slate-600 dark:text-slate-300">아직 연결된 영상이 없습니다.</p>
      )}
    </div>
  );
}
