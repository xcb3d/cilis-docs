"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  useClerk,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { NotificationPopover } from "../NotificationPopover";
import EditableText from "../common/EditableText";
import Link from "next/link";
import { useEffect, useState } from "react";
import AvatarStack from "../features/editor/user/AvatarStack";
import { documentService } from "@/services/documentService";
import dynamic from "next/dynamic";

const DynamicNotificationPopover = dynamic(() => import("../NotificationPopover").then(mod => ({ default: mod.NotificationPopover })), {
  ssr: false,
  loading: () => <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
});

const DynamicAvatarStack = dynamic(() => import("../features/editor/user/AvatarStack"), {
  ssr: false,
  loading: () => (
    <div className="flex -space-x-2">
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
    </div>
  )
});

const DynamicEditableText = dynamic(() => import("../common/EditableText"), {
  loading: () => <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
});


const HeaderContent = ({ id }) => {
  const pathname = usePathname();
  const { user } = useUser();
  const [documentTitle, setDocumentTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const { signOut } = useClerk()
  const router = useRouter()

  useEffect(() => {
    const fetchDocumentTitle = async () => {
      if (pathname.includes("/document")) {
        const documentId = pathname.split("/")[2];
          try {
            setLoading(true);
            const data = await documentService.getDocument(documentId).catch(err => setDocumentTitle(""));

            setDocumentTitle(data.title);
          } catch (error) {
            console.error("Error fetching document title:", error);
            // Có thể thêm xử lý lỗi ở đây (ví dụ: hiển thị toast)
          } finally {
            setLoading(false);
          }
      }
    };

    fetchDocumentTitle();
  }, [pathname]);

  useEffect(() => {
    if (documentTitle.length === 0) {
      setDocumentTitle("Empty document");
    }
  }, [documentTitle]);

  const handleUpdateTitle = async (newTitle) => {
    if (pathname.includes("/document")) {
      const documentId = pathname.split("/")[2];
      try {
        // const response = await fetch(`/api/document/${documentId}`, {
        //   method: "PATCH",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ title: newTitle }),
        // });

        const data = await documentService.updateDocument(documentId, newTitle);

        if (!response.ok) {
          throw new Error(data.error || "An error occurred while updating title");
        }

        setDocumentTitle(newTitle);
      } catch (error) {
        console.error("Error updating document title:", error);
        // Có thể thêm xử lý lỗi ở đây
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Force client-side navigation
      // window.location.href = "/sign-in";
      router.push("/sign-in");
    } catch (error) {
      console.error("Error when signing out:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm h-20 w-full flex items-center p-4 text-black justify-between fixed top-0 z-50">
      <div className="flex items-center gap-4">
        <Link href="/"> 
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
        </Link>
        {pathname.includes("/document") ? (
          <>
            {loading ? (
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <DynamicEditableText
                initialText={documentTitle}
                onUpdate={handleUpdateTitle}
              />
            )}
          </>
        ) : (
          <h1 className="text-2xl font-semibold">Calis Docs</h1>
        )}
      </div>
      <div className="flex gap-6 items-center">
        {id!=='abcd' && <DynamicAvatarStack />}
        {user && <DynamicNotificationPopover />}
        {user && (
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/sign-in"
                signOutCallback={handleSignOut}
              />
            </SignedIn>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderContent;
