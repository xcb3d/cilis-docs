import { InboxNotification } from "@liveblocks/react-ui";
import { useUser } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import { useDocumentData } from "@/hooks/useDocumentData"; // Import custom hook
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho toast

export function InviteNotification({ inboxNotification, token }) {
  const { inviteFrom, roomId } = inboxNotification.activities[0].data;
  let { readAt } = inboxNotification;
  const [readAtDate, setReadAtDate] = useState(readAt);
  const { id, subjectId } = inboxNotification;
  inboxNotification.readAt = readAtDate

  // Sử dụng custom hook để fetch document data
  const { documentData, isLoading, error } = useDocumentData(roomId);
  
  const { user: inviter } = useUser(inviteFrom);
  // const inviter = {}

  // Loading state
  if (isLoading) {
    return (
      <InboxNotification.Custom
        inboxNotification={inboxNotification}
        title="Đang tải..."
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
        title="Không thể tải thông tin"
        aside={<InboxNotification.Avatar userId={inviteFrom} />}
      >
        <div>Đã xảy ra lỗi khi tải thông tin tài liệu</div>
      </InboxNotification.Custom>
    );
  }

  const updateReadAt = async (token, id) => {
    try {
      console.log(token, id)
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
      return true; // Trả về true nếu cập nhật thành công
  
    } catch (error) {
      console.error("Error updating read at:", error);
      return false; // Trả về false nếu có lỗi xảy ra
    }
  }

  const handleAccept = async () => {
    const updated = await updateReadAt(token, id);
    if (updated) {
      setReadAtDate(new Date());
      // Thực hiện hành động accept
      try {
        const response = await fetch('/api/liveblock/invite/action', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subjectId: subjectId, // id của lời mời
            action: 'accept'
          }),
        });
  
        if (response.ok) {
          setReadAtDate(new Date());
          toast.success("Đã chấp nhận lời mời thành công!"); // Hiển thị thông báo thành công
        } else {
          toast.error("Có lỗi xảy ra khi chấp nhận lời mời."); // Hiển thị thông báo lỗi
        }
      } catch (error) {
        console.error("Error accepting invitation:", error);
        toast.error("Có lỗi xảy ra khi chấp nhận lời mời."); // Hiển thị thông báo lỗi
      }
    } else {
      toast.error("Có lỗi xảy ra"); // Hiển thị thông báo lỗi
    }
  };

  const handleDecline = async () => {
    const updated = await updateReadAt(token, id);
    if (updated) {
      setReadAtDate(new Date());
      // Thực hiện hành động từ chối
      try {
        const response = await fetch('/api/liveblock/invite/action', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subjectId: subjectId, // id của lời mời
            action: 'decline'
          }),
        });
  
        if (response.ok) {
          setReadAtDate(new Date());
          toast.success("Đã chấp nhận lời mời thành công!"); // Hiển thị thông báo thành công
        } else {
          toast.error("Có lỗi xảy ra khi chấp nhận lời mời."); // Hiển thị thông báo lỗi
        }
      } catch (error) {
        console.error("Error accepting invitation:", error);
        toast.error("Có lỗi xảy ra khi chấp nhận lời mời."); // Hiển thị thông báo lỗi
      }
    } else {
      toast.error("Có lỗi xảy ra"); // Hiển thị thông báo lỗi
    }
  };

  return (
    <InboxNotification.Custom
      inboxNotification={inboxNotification}
      title={
        <>
          <strong>{inviter?.name || 'Unknown user'}</strong> đã mời bạn vào{" "}
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
            Chấp nhận
          </button>
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Từ chối
          </button>
        </div>
      )}
    </InboxNotification.Custom>
  );
}
