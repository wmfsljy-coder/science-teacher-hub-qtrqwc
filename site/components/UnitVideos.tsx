"use client";

/*
 * 과목 화면(c/[repo]) 단원 카드의 '▶️ 영상 모음' 단추(수업 열기 · 지도안·QR 옆).
 * 누르면 그 단원에 연결된 유튜브 영상 목록(그림·제목·소단원·길이)만 카드 안에 펼쳐 보여 주고, 바로 틀지는 않습니다.
 * 목록에서 영상을 고르면 유튜브 쇼츠 주소(youtube.com/shorts/ID)가 새 탭으로 열립니다.
 * 연결된 영상이 없으면 흐린 '영상 준비 중' 표시만 둡니다. 목록은 허브 data/videos.json 에서 옵니다.
 */
import { useState, type ReactNode } from "react";

export type UnitVideo = { id: string; title: string; dur: string; secs: string[] };

export default function UnitVideos({ videos, unitTitle, children }: { videos: UnitVideo[]; unitTitle: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = `uv-${unitTitle.replace(/\s+/g, "-")}`;

  return (
    <div className="mt-auto p-4 sm:p-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {children}
        {videos.length ? (
          <button
            type="button"
            onClick={() => setOpen((x) => !x)}
            aria-expanded={open}
            aria-controls={panelId}
            className={`col-span-2 inline-flex min-h-14 items-center justify-center gap-1 whitespace-nowrap rounded-2xl border-2 px-2 text-lg font-bold sm:text-base transition focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-teal-500 active:scale-[.98] sm:col-span-1 ${
              open
                ? "border-red-600 bg-red-600 text-white dark:border-red-500 dark:bg-red-500"
                : "border-red-500 bg-white text-red-700 hover:bg-red-50 dark:border-red-400 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-950/40"
            }`}
          >
            ▶️ 영상 모음 <span className="tabular-nums">{videos.length}</span>
            <span aria-hidden className="text-sm">{open ? "▲" : "▼"}</span>
          </button>
        ) : (
          <span
            title="이 단원에는 아직 연결된 영상이 없습니다"
            className="col-span-2 inline-flex min-h-14 cursor-default items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-3 text-base font-bold text-slate-400 sm:col-span-1 dark:border-slate-700 dark:text-slate-500"
          >
            영상 준비 중
          </span>
        )}
      </div>

      {open && videos.length > 0 && (
        <div id={panelId} className="mt-3 rounded-2xl border-2 border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-950">
          <p className="px-2 pb-1.5 pt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
            이 단원 관련 영상 {videos.length}편 · 고르면 유튜브 쇼츠로 열립니다
          </p>
          <ul className="space-y-1.5">
            {videos.map((v) => {
              const [main, sub] = v.title.split("|").map((s) => s.trim());
              return (
                <li key={v.id}>
                  <a
                    href={`https://youtube.com/shorts/${v.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-16 items-center gap-3 rounded-xl bg-white p-2 transition hover:bg-red-50 focus-visible:outline-4 focus-visible:outline-teal-500 dark:bg-slate-900 dark:hover:bg-red-950/30"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.ytimg.com/vi/${v.id}/oardefault.jpg`}
                      onError={(e) => {
                        const t = e.currentTarget;
                        if (!t.dataset.fb) {
                          t.dataset.fb = "1";
                          t.src = `https://i.ytimg.com/vi/${v.id}/default.jpg`;
                        }
                      }}
                      alt=""
                      width={56}
                      height={56}
                      loading="lazy"
                      className="h-14 w-14 shrink-0 rounded-lg object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-bold leading-snug break-keep">{main}</span>
                      <span className="mt-0.5 block text-sm leading-snug text-slate-500 break-keep dark:text-slate-400">
                        {[sub, v.secs.join(" · "), v.dur].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    <span aria-hidden className="shrink-0 rounded-lg bg-red-600 px-2 py-1 text-sm font-bold text-white">
                      쇼츠 ↗
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
