import React, { useEffect, useState } from 'react';
import { useCommunityChatStore } from '../store/useCommunityChatStore';
import { MessageSquare, Search, Hash } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import SidebarSkeleton from './skeletons/SideSkeleton';

/**
 * Formats a raw channel name into a clean, modern developer room name.
 * e.g., "react-tuto-3a4f" -> "# React Tuto"
 */
export function formatRoomName(rawName) {
  if (!rawName) return "Study Room";
  if (rawName.startsWith("#")) return rawName;
  // Strip trailing random 4-char hex hash like "-3a4f" if present
  let clean = rawName.replace(/-[a-f0-9]{4}$/i, '');
  // Replace hyphens and underscores with spaces
  clean = clean.replace(/[-_]+/g, ' ').trim();
  // Capitalize each word
  clean = clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return `# ${clean}`;
}

function CommunitySidebar() {
  const { getJoinedCommunities, joinedCommunity, selectedCommunity, setSelectedCommunity, isCommunityLoading } = useCommunityChatStore();
  const { getToken } = useAuth();
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchCommunities = async () => {
      const token = await getToken();
      getJoinedCommunities(token);
    };
    fetchCommunities();
  }, [getJoinedCommunities]);

  if (isCommunityLoading) return <SidebarSkeleton />;

  // Sort so newly added/joined rooms are at the very top
  const sortedCommunities = [...(joinedCommunity || [])].reverse();

  const filteredCommunities = sortedCommunities.filter(c => {
    const formatted = formatRoomName(c.channelName || "");
    const raw = (c.channelName || "").toLowerCase();
    const query = filterText.toLowerCase();
    return raw.includes(query) || formatted.toLowerCase().includes(query);
  });

  return (
    <aside className="h-full w-full flex flex-col bg-base-100">
      {/* Header */}
      <div className="p-4 border-b border-base-300 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-primary" strokeWidth={1.5} />
            <span className="font-bold text-xs uppercase tracking-wider text-base-content font-mono">
              Joined Rooms ({joinedCommunity?.length || 0})
            </span>
          </div>
        </div>

        {/* Quick filter */}
        <div className="relative">
          <input
            type="text"
            placeholder="Filter rooms..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="input input-xs input-bordered w-full pr-7 rounded-lg text-xs font-mono"
          />
          <Search className="size-3 text-base-content/40 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Room list */}
      <div className="overflow-y-auto flex-1 divide-y divide-base-200">
        {filteredCommunities.length === 0 ? (
          <div className="p-6 text-center space-y-2">
            <p className="text-xs text-base-content/70 font-medium">No course rooms yet.</p>
            <p className="text-[11px] text-base-content/50">
              Browse any course on the home or topic page and click "Room" to join.
            </p>
          </div>
        ) : (
          filteredCommunities.map((community) => {
            const isSelected = selectedCommunity?._id === community._id;
            const displayName = formatRoomName(community.channelName);

            return (
              <button
                key={community._id}
                onClick={() => setSelectedCommunity(community)}
                className={`
                  w-full p-3.5 flex items-center gap-3 text-left transition-colors cursor-pointer
                  ${isSelected ? "bg-base-200 border-l-3 border-primary" : "hover:bg-base-200/50"}
                `}
              >
                <div className="avatar shrink-0">
                  <div className="size-10 rounded-xl bg-base-300 border border-base-300 overflow-hidden flex items-center justify-center">
                    {community.channelImg ? (
                      <img
                        src={community.channelImg}
                        alt={displayName}
                        onError={(e) => { e.target.src = '/avatar.png'; }}
                      />
                    ) : (
                      <Hash className="size-5 text-primary opacity-70" strokeWidth={1.5} />
                    )}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-xs text-base-content truncate font-mono">
                    {displayName}
                  </h4>
                  <p className="text-[11px] text-base-content/60 truncate mt-0.5">
                    Click to enter room chat
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}

export default CommunitySidebar;
