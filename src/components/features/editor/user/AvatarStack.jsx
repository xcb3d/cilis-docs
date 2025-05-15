'use client';

import { useOthers, useSelf } from "@liveblocks/react";
import Avatar from "./Avatar";

const AvatarStack = () => {
  const users = useOthers();
  const currentUser = useSelf();
  const uniqueUsers = Array.from(new Map(users.map(user => [user.id, user])).values())
  const hasMoreUsers = uniqueUsers.length > 3;

  return (
    <div className="flex pl-3 justify-center items-center h-full">
      {uniqueUsers.slice(0, 3).map(({ connectionId, info }) => {
        return <Avatar key={connectionId} src={info.avatar} name={info.name} />;
      })}

      {hasMoreUsers && <div className="border-4 rounded-full border-white bg-gray-400 min-w-9 w-9 h-9 -ml-3 flex justify-center items-center text-white text-xs">+{uniqueUsers.length - 3}</div>}

      {currentUser && (
        <div className="relative ml-3 first:ml-0">
          <Avatar src={currentUser.info.avatar} name="You" />
        </div>
      )}
    </div>
  );
};

export default AvatarStack;
