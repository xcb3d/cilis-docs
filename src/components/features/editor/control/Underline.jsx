import React from "react";
import ToolbarButton from "@/components/common/ToolbarButton";
import { FaUnderline } from "react-icons/fa";

const Underline = ({ editor }) => {
  return (
    <ToolbarButton
      icon={FaUnderline}
      label="Gạch chân"
      active={editor.isActive("underline")}
      onClick={() => editor.chain().focus().toggleUnderline().run()}
    />
  );
};

export default Underline;
