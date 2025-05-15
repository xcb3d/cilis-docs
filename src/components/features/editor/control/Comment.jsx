import ToolbarButton from "@/components/common/ToolbarButton";
import { FaCommentDots } from "react-icons/fa";

const Comment = ({ editor }) => {
  return (
    <ToolbarButton
      icon={FaCommentDots}
      label="Nhận xét"
      active={false}
      onClick={() => {
        editor.chain().focus().addPendingComment().run()
      }}
    />
  );
};

export default Comment;
