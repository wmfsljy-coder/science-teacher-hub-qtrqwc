"use client";

/*
 * 칠판모드 소단원 카드의 '▶️ 영상 모음' 단추(📺 칠판 강의 바로 옆).
 * 그 소단원에 연결된 유튜브 영상(허브 data/videos.json + board 파일의 sth-video 메타)을 이 화면 위에 크게 띄워 바로 틉니다.
 * 영상이 여러 편이면 플레이어 아래 그림 단추로 바꿔 봅니다. 연결된 영상이 없으면 흐린 '영상 준비 중' 표시만 둡니다.
 */
import { useEffect, useState } from "react";

export type BoardVideo = { id: string; url: string; title: string; label: string };

const btn =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border-2 border-red-500 bg-white px-3 text-sm font-bold text-red-700 transition hover:bg-red-50 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-teal-500 dark:border-red-400 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-950/40";
const empty =
  "inline-flex min-h-11 cursor-default items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 px-3 text-sm font-bold text-slate-400 dark:border-slate-700 dark:text-slate-500";

export default function BoardVideos({ videos, name }: { videos: BoardVideo[]; name: string }) {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  /* 띄운 동안: Esc 로 닫기, 뒤 화면 스크롤 막기 */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!videos.length) {
    return (
      <span className={empty} title="이 소단원에는 아직 연결된 영상이 없습니다">
        ▶️ 영상 준비 중
      </span>
    );
  }

  const cur = videos[Math.min(i, videos.length - 1)];
  const many = videos.length > 1;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setI(0);
          setOpen(true);
        }}
        className={btn}
        title={videos.map((v) => v.title).join("\n")}
      >
        ▶️ 영상 모음{many ? ` ${videos.length}` : ""}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} 관련 영상`}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/85 p-4"
        >
          <p onClick={(e) => e.stopPropagation()} className="max-w-[92vw] text-center text-base font-bold text-white">
            {name} · {cur.title}
          </p>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ height: many ? "min(64vh, calc(92vw * 16 / 9))" : "min(74vh, calc(92vw * 16 / 9))", aspectRatio: "9 / 16" }}
            className="max-w-[92vw]"
          >
            <iframe
              key={cur.id}
              src={`https://www.youtube-nocookie.com/embed/${cur.id}?autoplay=1&rel=0&playsinline=1`}
              title={cur.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="h-full w-full rounded-2xl border-0 bg-black"
            />
          </div>
          {many && (
            <div onClick={(e) => e.stopPropagation()} className="flex max-w-[92vw] flex-wrap justify-center gap-2">
              {videos.map((v, k) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setI(k)}
                  aria-pressed={k === i}
                  className={`flex min-h-12 items-center gap-2 rounded-xl border-2 py-1 pl-1 pr-3 text-sm font-bold transition focus-visible:outline-4 focus-visible:outline-teal-400 ${
                    k === i ? "border-red-500 bg-red-600 text-white" : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.ytimg.com/vi/${v.id}/default.jpg`} alt="" width={48} height={36} className="h-9 w-12 rounded-md object-cover" />
                  {v.label}
                </button>
              ))}
            </div>
          )}
          <div onClick={(e) => e.stopPropagation()} className="flex flex-wrap justify-center gap-3">
            <a
              href={cur.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center rounded-2xl bg-white px-5 text-base font-bold text-slate-900 hover:bg-slate-200 focus-visible:outline-4 focus-visible:outline-teal-400"
            >
              유튜브에서 열기 ↗
            </a>
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 items-center rounded-2xl bg-red-600 px-5 text-base font-bold text-white hover:bg-red-700 focus-visible:outline-4 focus-visible:outline-teal-400"
            >
              ✕ 닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
