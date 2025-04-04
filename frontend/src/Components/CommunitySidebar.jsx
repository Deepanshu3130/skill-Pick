import React, { useEffect } from 'react';
import { useCommunityChatStore } from '../store/useCommunityChatStore';
import { Users } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

function CommunitySidebar() {
    const { getJoinedCommunities, joinedCommunity, selectedCommunity, setSelectedCommunity, isCommunityLoading } = useCommunityChatStore();
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchCommunities = async () => {
            const token = await getToken();
            getJoinedCommunities(token);
        };
        fetchCommunities();
    }, [getJoinedCommunities]);

    if (isCommunityLoading) return <div>Loading...</div>;

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">Communities</span>
                </div>
            </div>

            <div className="overflow-y-auto w-full py-3">
                {joinedCommunity.map((community) => (
                    <button
                        key={community._id}
                        onClick={() => setSelectedCommunity(community)}
                        className={`
                            w-full p-3 flex items-center gap-3
                            hover:bg-base-300 transition-colors
                            ${selectedCommunity?._id === community._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                        `}
                    >
                        <div className="relative mx-auto lg:mx-0">
                            <img
                                src={community.channelImg || "/group-avatar.png"}
                                alt={community.channelName}
                                className="size-12 object-cover rounded-full"
                            />
                        </div>

                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{community.channelName}</div>
                        </div>
                    </button>
                ))}
            </div>
        </aside>
    );
}

export default CommunitySidebar;
