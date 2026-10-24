import React, { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { Users, Search } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import SidebarSkeleton from './skeletons/SideSkeleton';

function Sidebar() {
  const { getUsers, users, selectedUser, setSelctedUser, isUserLoading } = useChatStore();
  const { getToken } = useAuth();
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await getToken();
      getUsers(token);
    };
    fetchUsers();
  }, [getUsers]);

  if (isUserLoading) return <SidebarSkeleton />;

  const filteredUsers = (users || []).filter(u => {
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    return fullName.includes(filterText.toLowerCase());
  });

  return (
    <aside className="h-full w-full flex flex-col bg-base-100">
      {/* Header */}
      <div className="p-4 border-b border-base-300 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-primary" strokeWidth={1.5} />
            <span className="font-bold text-xs uppercase tracking-wider text-base-content">
              Contacts ({users?.length || 0})
            </span>
          </div>
        </div>

        {/* Quick filter */}
        <div className="relative">
          <input
            type="text"
            placeholder="Filter contacts..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="input input-xs input-bordered w-full pr-7 rounded-lg text-xs"
          />
          <Search className="size-3 text-base-content/40 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* User list */}
      <div className="overflow-y-auto flex-1 divide-y divide-base-200">
        {filteredUsers.length === 0 ? (
          <div className="p-6 text-center space-y-2">
            <p className="text-xs text-base-content/70 font-medium">No contacts found.</p>
            <p className="text-[11px] text-base-content/50">
              When other learners send messages or you say hi in a room, they will show up here.
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isSelected = selectedUser?._id === user._id;
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Community Member';

            return (
              <button
                key={user._id}
                onClick={() => setSelctedUser(user)}
                className={`
                  w-full p-3.5 flex items-center gap-3 text-left transition-colors cursor-pointer
                  ${isSelected ? "bg-base-200 border-l-3 border-primary" : "hover:bg-base-200/50"}
                `}
              >
                <div className="avatar shrink-0">
                  <div className="size-10 rounded-full bg-base-300 border border-base-300">
                    <img
                      src={user.profilePicture || "/avatar.png"}
                      alt={fullName}
                      onError={(e) => { e.target.src = '/avatar.png'; }}
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-xs text-base-content truncate">
                    {fullName}
                  </h4>
                  <p className="text-[11px] text-base-content/60 truncate mt-0.5">
                    Click to direct message
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

export default Sidebar;
