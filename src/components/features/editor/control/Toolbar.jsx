import React from "react";
import Functionality from "../Functionality";
import TextColorPicker from "./TextColorPicker";
import HighlightColorPicker from "./HightlightColorPicker";
import Bold from "./Bold";
import Italic from "./Italic";
import Underline from "./Underline";
import Comment from "./Comment";
import Redo from "./Redo";
import Undo from "./Undo";
import Print from "./Print";
import Table from "./Table";
import TextAlign from "./TextAlign";
import BulletList from "./BulletList";
import OrderedList from "./OrderedList";
import TaskList from "./TaskList"
import ImageUpload from "./ImageUpload";
import Invite from "./Invite";
// import AvatarStack from "@/components/AvatarStack";
const Toolbar = ({ editor }) => {
  if (!editor) return null;
  return (
    <div className="flex gap-2 bg-gray-50 text-black items-center z-50 fixed mt-px w-full">
      <div className="flex gap-1 px-2 border-r border-gray-300">
        <Undo editor={editor} />
        <Redo editor={editor} />
      </div>
      <div className="flex gap-1 pr-2 border-r border-gray-300">
        <Print />
      </div>
      <Functionality editor={editor} />
      {/* Text Formatting */}
      <div className="flex space-x-1 border-r border-l pl-2 pr-2 md:border-r-gray-300 md:border-l-gray-300">
        <Bold editor={editor} />
        <Italic editor={editor} />
        <Underline editor={editor} />
      </div>
      <div className="flex gap-1 px-2 border-r border-gray-300">
        <TextAlign editor={editor} />
        <BulletList editor={editor} />
        <OrderedList editor={editor} />
        <TaskList editor={editor} />
      </div>
      <div className="flex gap-2 pr-2 border-r border-gray-300">
        <TextColorPicker editor={editor} />
        <HighlightColorPicker editor={editor} />
      </div>
      <Comment editor={editor} />
      <Table editor={editor} />
      <ImageUpload editor={editor} />
      <Invite />
    </div>
  );
};

export default Toolbar;
