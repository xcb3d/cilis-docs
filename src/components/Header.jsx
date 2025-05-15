"use client";

import DocumentHeader from "@/components/layout/DocumentHeader";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import HeaderContent from "./layout/HeaderContent";
import { liveblockService } from "@/services/liveblockService";

const Header = ({ id }) => {

  // const { user } = useUser();
  // if (!user) {
  //   return <div className="flex h-full justify-center items-center">
  //   <DocumentHeader />
  // </div>
  // }

  return (
    <LiveblocksProvider
      authEndpoint={async (room) => {
        const response = await fetch("/api/liveblock/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            room: room,
            type: "getNoti",
          }),
        });
        const data = await response.json();
        return await data;
      }}
      resolveUsers={async ({ userIds }) => {
        const data = await liveblockService.resolveUsers(userIds);
        return data
      }}
      resolveRoomsInfo={async ({ roomIds }) => {
        const response = await fetch('/api/document/info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ roomIds })
        });

        if (!response.ok) {
          throw new Error('Không thể lấy thông tin tài liệu');
        }
        const data = await response.json();
        return data;
      }}
    >
      <RoomProvider id={id}>
        <ClientSideSuspense
          fallback={
            <div className="flex h-full justify-center items-center">
              <DocumentHeader />
            </div>
          }
        >
          <HeaderContent id={id} />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};

export default Header;
