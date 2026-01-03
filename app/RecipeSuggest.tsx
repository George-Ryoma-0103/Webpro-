"use client";

import { useEffect, useState } from "react";

type FoodData = {
  name: string;
  amount: number;
};

type Props = {
  foods: FoodData[];
};

export default function RecipeSuggest({ foods }: Props) {
  if (foods.length === 0) return null;

  const [seed, setSeed] = useState(0);

  /* =========================
     廃棄量順
  ========================= */
  const sortedFoods = [...foods].sort((a, b) => b.amount - a.amount);
  const topFoods = sortedFoods.slice(0, 3);

  /* =========================
     APIから取得するランク
  ========================= */
  const [rank, setRank] = useState("");
  const [rankReason, setRankReason] = useState("");
  const totalAmount = foods.reduce((sum, f) => sum + f.amount, 0);

  useEffect(() => {
    fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalAmount }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRank(data.rank);
        setRankReason(data.reason);
      });
  }, [foods]);
  

  /* =========================
     AI理由（表示用）
  ========================= */
  const reasons = [
    "廃棄量の多い食材を優先的に消費することで、食品ロス削減効果が最大化されると判断しました。",
    "現在の食材状況から、単品ごとに調理する方が無駄が出にくいと分析しました。",
    "調理負担を抑えつつ、確実に消費できる献立構成が適していると推測されます。",
  ];

  const randomReason =
    reasons[Math.floor((Math.random() + seed) * reasons.length) % reasons.length];

  /* =========================
     食材ごとのランダム料理
  ========================= */
  const methods = ["炒め", "煮", "焼き", "スープ", "丼"];

  const todayMenus = topFoods.map((food) => {
    const method = methods[Math.floor(Math.random() * methods.length)];
    return `${food.name}を使った${method}料理`;
  });

  /* =========================
     Cookpad（1位のみ）
  ========================= */
  const cookpadUrl = `https://cookpad.com/jp/search/${encodeURIComponent(
    sortedFoods[0].name
  )}`;

  return (
    <div className="mt-6 space-y-6 p-6 border-2 border-green-300 rounded-2xl bg-gradient-to-br from-green-50 to-white shadow">

      {/* ===== AI提案 ===== */}
      <div>
        <h2 className="text-xl font-extrabold text-green-700 mb-2">
          🤖 AIによるレシピ提案
        </h2>

        <p className="text-sm mb-2">
          <span className="font-semibold text-green-700">分析理由：</span>
          {randomReason}
        </p>

        <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
          {todayMenus.map((menu, i) => (
            <li key={i}>{menu}</li>
          ))}
        </ul>

        {/* ===== API判定結果 ===== */}
        <div className="text-sm mb-3">
          🔔 今日作るべき度：
          <span className="ml-1 font-bold text-green-700">
            {rank}ランク
          </span>
          <p className="text-xs text-gray-600 mt-1">
            {rankReason}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            🔄 AI提案を再生成
          </button>

          <a
            href={cookpadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-green-600 text-green-700 rounded hover:bg-green-100"
          >
            🍳 Cookpadでレシピを見る（{sortedFoods[0].name}）
          </a>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        ※ 廃棄量データをもとにサーバーサイドAPIが判定しています
      </p>
    </div>
  );
}
