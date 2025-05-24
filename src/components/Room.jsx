"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
  useOthers,
} from "@liveblocks/react/suspense";
import Spinner from "@/components/common/Spinner";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
// import StatusMessage from "./StatusMessage";
import { liveblockService } from "@/services/liveblockService";
const StatusMessage = dynamic(() => import("@/components/common/StatusMessage"), { loading: () => <Spinner /> });
export function Room({ children, id }) {
  const [accessStatus, setAccessStatus] = useState("checking");
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    const checkAccess = async () => {
      try {
        let error = null;
        const data = await liveblockService.authenticate(id).catch(err => error = err.response.data);

        if (!error) {
          setAccessStatus("granted");
          return;
        }
        switch (error?.status) {
          case "success":
            setAccessStatus("granted");
            break;
          case "forbidden":
            setAccessStatus("denied");
            setErrorMessage(
              data.message || "You don't have access to this document"
            );
            break;
          case "unauthorized":
            setAccessStatus("denied");
            setErrorMessage(data.message || "Please login to continue");
            break;
          default:
            setAccessStatus("error");
            setErrorMessage(data.message || "An error occurred");
        }
      } catch (error) {
        setAccessStatus("error");
        setErrorMessage("Unable to connect to server");
      }
    };

    checkAccess();
  }, [id]);

  if (accessStatus !== "granted") {
    return <StatusMessage
      accessStatus={accessStatus}
      errorMessage={errorMessage}
    />;
  }


  return (
    <LiveblocksProvider
      authEndpoint={async (room) => {
        const data = await liveblockService.authenticate(id);

        if (data.status !== "success") {
          throw new Error(data.message || "Authentication failed");
        }

        return data;
      }}
      resolveUsers={async ({ userIds }) => {
        // Join array thành string và encode
        const params = new URLSearchParams({
          userIds: userIds.join(","),
        });

        const data = await liveblockService.resolveUsers(userIds);
        return data;
      }}
      resolveMentionSuggestions={async ({ text }) => {
        // Encode parameters để tránh các ký tự đặc biệt
        const params = new URLSearchParams({
          text,
          roomId: id,
        });

        const data = await liveblockService.getMentionSuggestions(text, id);
        return data;
      }}
    >
      <RoomProvider id={id}>
        <ClientSideSuspense
          fallback={
            <div className="flex h-full justify-center items-center">
              <Spinner />
            </div>
          }
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
