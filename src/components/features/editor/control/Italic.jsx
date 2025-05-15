import React from "react";
import ToolbarButton from "@/components/common/ToolbarButton";
import { FaItalic } from "react-icons/fa";

const Italic = ({ editor }) => {
  return (
    <ToolbarButton
      icon={FaItalic}
      label="In nghiêng"
      active={editor.isActive("italic")}
      onClick={() => editor.chain().focus().toggleItalic().run()}
    />
  );
};

export default Italic;
