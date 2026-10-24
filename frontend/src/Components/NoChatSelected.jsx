import React from "react";
import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-8 sm:p-16 bg-base-100">
      <div className="max-w-md text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-base-200 border border-base-300 flex items-center justify-center mx-auto text-primary">
          <MessageSquare className="size-6" strokeWidth={1.5} />
        </div>

        <h3 className="text-lg font-bold text-base-content">
          Select a room or contact
        </h3>
        <p className="text-xs sm:text-sm text-base-content/65 max-w-sm mx-auto leading-relaxed">
          Choose a course room or contact from the sidebar to view chat history and start learning with peers.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
