import ToolbarButton from "@/components/common/ToolbarButton";
import { FaBold } from "react-icons/fa";

const Bold = ({ editor }) => {
  return (
    <ToolbarButton
      icon={FaBold}
      label="Bold"
      active={editor.isActive("bold")}
      onClick={() => editor.chain().focus().toggleBold().run()}
    />
  );
};

export default Bold;
