import { InboxNotification } from "@liveblocks/react-ui";
import { useUser } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import { useDocumentData } from "@/hooks/useDocumentData"; // Import custom hook
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast

export function InviteNotification({ inboxNotification, token }) {
  const { inviteFrom, roomId } = inboxNotification.activities[0].data;
  let { readAt } = inboxNotification;
  const [readAtDate, setReadAtDate] = useState(readAt);
  const { id, subjectId } = inboxNotification;
  inboxNotification.readAt = readAtDate

  // Use custom hook to fetch document data
  const { documentData, isLoading, error } = useDocumentData(roomId);
  
  const { user: inviter } = useUser(inviteFrom);
  // const inviter = {}

  // Loading state
  if (isLoading) {
    return (
      <InboxNotification.Custom
        inboxNotification={inboxNotification}
        title="Loading..."
        aside={<InboxNotification.Avatar userId={inviteFrom} />}
      >
        <div>Loading...</div>
      </InboxNotification.Custom>
    );
  }

  // Error state
  if (error) {
    return (
      <InboxNotification.Custom
        inboxNotification={inboxNotification}
        title="Unable to load document info"
        aside={<InboxNotification.Avatar userId={inviteFrom} />}
      >
        <div>An error occurred when loading document info</div>
      </InboxNotification.Custom>
    );
  }

  const updateReadAt = async (token, id) => {
    try {
      const response = await fetch('https://api.liveblocks.io/v2/c/inbox-notifications/read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          "inboxNotificationIds": [id]
        })
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      return true; // Return true if update is successful
  
    } catch (error) {
      console.error("Error updating read at:", error);
      return false; // Return false if an error occurs
    }
  }

  const handleAccept = async () => {
    const updated = await updateReadAt(token, id);
    if (updated) {
      setReadAtDate(new Date());
      // Perform accept action
      try {
        const response = await fetch('/api/liveblock/invite/action', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subjectId: subjectId, // invitation id
            action: 'accept'
          }),
        });
  
        if (response.ok) {
          setReadAtDate(new Date());
          toast.success("Invitation accepted successfully!"); // Show success message
        } else {
          toast.error("An error occurred when accepting invitation."); // Show error message
        }
      } catch (error) {
        console.error("Error accepting invitation:", error);
        toast.error("An error occurred when accepting invitation."); // Show error message
      }
    } else {
      toast.error("An error occurred"); // Show error message
    }
  };

  const handleDecline = async () => {
    const updated = await updateReadAt(token, id);
    if (updated) {
      setReadAtDate(new Date());
      // Perform decline action
      try {
        const response = await fetch('/api/liveblock/invite/action', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subjectId: subjectId, // invitation id
            action: 'decline'
          }),
        });
  
        if (response.ok) {
          setReadAtDate(new Date());
          toast.success("Invitation accepted successfully!"); // Show success message
        } else {
          toast.error("An error occurred when accepting invitation."); // Show error message
        }
      } catch (error) {
        console.error("Error accepting invitation:", error);
        toast.error("An error occurred when accepting invitation."); // Show error message
      }
    } else {
      toast.error("An error occurred"); // Show error message
    }
  };

  return (
    <InboxNotification.Custom
      inboxNotification={inboxNotification}
      title={
        <>
          <strong>{inviter?.name || 'Unknown user'}</strong> invited you to{" "}
          <strong>{documentData.title}</strong>
        </>
      }
      aside={<InboxNotification.Avatar userId={inviteFrom} />}
    >
      <div>
      </div>
      {!readAtDate && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Accept
          </button>
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Decline
          </button>
        </div>
      )}
    </InboxNotification.Custom>
  );
}
