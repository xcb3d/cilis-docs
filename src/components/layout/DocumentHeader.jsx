import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useInboxNotifications } from "@liveblocks/react";
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DocumentHeader = () => {
  const router = useRouter();
  return (
    <header className="bg-white shadow-sm h-20 w-full flex items-center p-4 text-black justify-between fixed top-0 z-50">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image src="/logo.png" alt="Logo" width={60} height={60} />
      </div>
      <h1 className="ml-4 text-2xl font-semibold">Calis Docs</h1>
      
      <div className="opacity-0">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default DocumentHeader;
