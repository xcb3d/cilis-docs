import React from "react";
import ToolbarButton from "@/components/common/ToolbarButton";
import { MdUndo } from "react-icons/md";

const Undo = ({ editor }) => {
  return (
    <ToolbarButton
      icon={MdUndo}
      label="Undo"
      active={editor.can().undo()}
      disabled={!editor.can().undo()}
      type="Undo"
      onClick={() => editor.chain().focus().undo().run()}
    />
  );
};

export default Undo;
