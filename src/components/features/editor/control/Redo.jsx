import React from "react";
import ToolbarButton from "@/components/common/ToolbarButton";
import { MdRedo } from "react-icons/md";

const Redo = ({ editor }) => {
  return (
    <ToolbarButton
      icon={MdRedo}
      label="Redo"
      active={editor.can().redo()}
      disabled={!editor.can().redo()}
      type="Redo"
      onClick={() => editor.chain().focus().redo().run()}
    />
  );
};

export default Redo;
