// liveblocks.config.js
import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  authEndpoint: async (room) => {
    const response = await fetch("/api/liveblock/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        room: room,
        type: "getToken",
      }),
    });

    const data = await response.json();

    if (data.status !== "success") {
      throw new Error(data.message || "Authentication failed");
    }

    return data;
  },
  // throttle: 100,
});

export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useOthers,
  useOthersMapped,
  useOthersConnectionIds,
  useOther,
  useSelf,
  useStorage,
  useObject,
  useMap,
  useList,
  useBroadcastEvent,
  useEventListener,
  useStatus,
  useLostConnectionCount,
} = createRoomContext(client);
