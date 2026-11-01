/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { KEY_SHARDS } from '../data/gameData.ts';

interface KeyShardsHudProps {
  unlockedShards: Set<string>;
  onShardClick?: (shardId: string) => void;
  className?: string;
}

export const KeyShardsHud: React.FC<KeyShardsHudProps> = ({
  unlockedShards,
  onShardClick,
  className = '',
}) => {
  const shardsList = [
    KEY_SHARDS.feather,
    KEY_SHARDS.water,
    KEY_SHARDS.bell,
    KEY_SHARDS.emblem,
  ];

  const totalCollected = shardsList.filter((s) => unlockedShards.has(s.id)).length;

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-md px-3 sm:px-4 py-2 rounded-2xl border-2 border-amber-200 shadow-md ${className}`}
    >
      <div className="flex items-center gap-1.5 pr-2 border-r border-amber-200">
        <span className="text-xl">🗝️</span>
        <div className="flex flex-col">
          <span className="text-[11px] font-extrabold text-amber-900 tracking-wider">
            CHÌA KHÓA ÂM THANH
          </span>
          <span className="text-[10px] font-bold text-amber-700">
            Đã tìm thấy: <span className="text-emerald-600 font-extrabold">{totalCollected}/4</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {shardsList.map((shard, index) => {
          const isCollected = unlockedShards.has(shard.id);
          return (
            <button
              key={shard.id}
              onClick={() => onShardClick?.(shard.id)}
              title={`${shard.name} (${shard.stageName}) - ${isCollected ? 'Đã thu thập' : 'Chưa mở khóa'}`}
              className={`relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl text-lg sm:text-xl transition-all duration-300 ${
                isCollected
                  ? 'bg-gradient-to-br from-amber-200 via-amber-300 to-yellow-400 border-2 border-amber-500 shadow-md scale-105 animate-pulse'
                  : 'bg-slate-100 border border-dashed border-slate-300 opacity-50 grayscale hover:opacity-75'
              }`}
            >
              <span>{shard.icon}</span>
              <span className="absolute -bottom-1 -right-1 text-[9px] font-extrabold px-1 rounded-full bg-slate-800 text-white">
                {index + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
