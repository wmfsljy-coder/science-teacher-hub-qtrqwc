"use client";

/*
 * 첫 화면 위쪽 '유튜브 영상 모음'.
 * 허브 data/videos.json(유튜브 「교실 너머 과학」 영상 ↔ 단원 연결)을 새것부터 보여 줍니다.
 * 영상을 누르면 이 화면 위에 크게 띄워 바로 틀고(교실 화면용), 단원 이름표를 누르면 그 단원으로 갑니다.
 * 새 영상은 data/videos.json 에 한 줄 더하면 여기에도 저절로 붙습니다.
 */
import { useEffect, useState } from "react";
import type { Video, VideoUnit } from "@/lib/content";
import { card, tone } from "@/lib/ui";

const CHANNEL = "https://www.youtube.com/@%EA%B5%90%EC%8B%A4%EB%84%88%EB%A8%B8%EA%B3%BC%ED%95%99";
/* 처음에 보이는 편 수(PC 한 줄, 휴대폰 두 줄). 나머지는 '모두 보기'로 펼침 */
const FIRST = 4;

/* 같은 과목·단원에 여러 소단원이 걸리면 이름표 하나로 묶음 */
function groupUnits(units: VideoUnit[]) {
  const map = new Map<string, { u: VideoUnit; secs: string[] }>();
  for (const u of units) {
    const k = `${u.course}|${u.chapter}`;
    const sec = `${u.n} ${u.section}`.trim();
    const hit = map.get(k);
    if (hit) hit.secs.push(sec);
    else map.set(k, { u, secs: [sec] });
  }
  return [...map.values()];
}

export default function VideoShelf({ videos }: { videos: Video[] }) {
  const [all, setAll] = useState(false);
  const [open, setOpen] = useState<Video | null>(null);

  /* 크게 띄운 동안: Esc 로 닫기, 뒤 화면 스크롤 막기 */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!videos.length) return null;
  const shown = all ? videos : videos.slice(0, FIRST);

  return (
    <section aria-labelledby="video-shelf-title" className={`${card} mb-8 p-4 sm:p-5`}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="video-shelf-title" className="text-xl font-extrabold tracking-tight sm:text-2xl">
            ▶️ 유튜브 영상 모음
          </h2>
          <p className="mt-1 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            「교실 너머 과학」 짧은 정리 영상 {videos.length}편. 그림을 누르면 이 화면에서 크게 틀고, 아래 이름표를 누르면 그 단원으로 갑니다.
          </p>
        </div>
        <a
          href={CHANNEL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-1 rounded-2xl border-2 border-slate-300 bg-white px-4 text-base font-bold text-slate-700 transition hover:border-red-500 hover:text-red-700 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-teal-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-red-400 dark:hover:text-red-300"
        >
          채널 전체 보기 ↗
        </a>
      </div>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {shown.map((v) => {
          const [main, sub] = v.title.split("|").map((s) => s.trim());
          return (
            <li
              key={v.id}
              className="flex flex-col overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950"
            >
              <button
                type="button"
                onClick={() => setOpen(v)}
                aria-label={`${main} 영상 틀기`}
                className="group relative block overflow-hidden bg-slate-900 focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-teal-400"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${v.id}/oardefault.jpg`}
                  onError={(e) => {
                    const t = e.currentTarget;
                    if (!t.dataset.fb) {
                      t.dataset.fb = "1";
                      t.src = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
                    }
                  }}
                  alt=""
                  width={360}
                  height={360}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                />
                <span aria-hidden className="absolute inset-0 grid place-items-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-black/60 pl-1 text-2xl text-white shadow-lg transition group-hover:bg-red-600">
                    ▶
                  </span>
                </span>
                {v.dur && (
                  <span className="absolute bottom-2 right-2 rounded-lg bg-black/75 px-2 py-0.5 text-sm font-bold text-white">
                    {v.dur}
                  </span>
                )}
              </button>
              <div className="flex flex-1 flex-col gap-2 p-3">
                <p className="text-base font-bold leading-snug break-keep">{main}</p>
                {sub && <p className="-mt-1 text-sm leading-snug text-slate-500 break-keep dark:text-slate-400">{sub}</p>}
                {v.units.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {groupUnits(v.units).map(({ u, secs }) => (
                      <a
                        key={`${u.course}-${u.chapter}`}
                        href={u.play}
                        title={`${u.course} ${u.chapter} ${u.title} · ${secs.join(", ")}`}
                        className={`inline-flex min-h-9 items-center rounded-xl px-2.5 text-sm font-bold transition hover:opacity-80 focus-visible:outline-4 focus-visible:outline-teal-500 ${tone(u.color).badge}`}
                      >
                        {u.course} {u.chapter}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {videos.length > FIRST && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setAll((x) => !x)}
            aria-expanded={all}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-slate-300 bg-white px-6 text-base font-bold text-slate-800 transition hover:border-teal-600 hover:text-teal-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-teal-500 active:scale-[.98] dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-teal-400 dark:hover:text-teal-200"
          >
            {all ? "접기 ▲" : `영상 ${videos.length}편 모두 보기 ▼`}
          </button>
        </div>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/85 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ height: "min(78vh, calc(92vw * 16 / 9))", aspectRatio: "9 / 16" }}
            className="max-w-[92vw]"
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${open.id}?autoplay=1&rel=0&playsinline=1`}
              title={open.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="h-full w-full rounded-2xl border-0 bg-black"
            />
          </div>
          <div onClick={(e) => e.stopPropagation()} className="flex flex-wrap justify-center gap-3">
            <a
              href={open.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center rounded-2xl bg-white px-5 text-base font-bold text-slate-900 hover:bg-slate-200 focus-visible:outline-4 focus-visible:outline-teal-400"
            >
              유튜브에서 열기 ↗
            </a>
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(null)}
              className="inline-flex min-h-12 items-center rounded-2xl bg-red-600 px-5 text-base font-bold text-white hover:bg-red-700 focus-visible:outline-4 focus-visible:outline-teal-400"
            >
              ✕ 닫기
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
