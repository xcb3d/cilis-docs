"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import { FontSizeMark } from "@/extension/FontSizeMark";
import Toolbar from "@/components/features/editor/control/Toolbar";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import FontFamily from "@tiptap/extension-font-family";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { ZoomExtension } from "@/extension/ZoomExtension";
import Table from "@tiptap/extension-table";
import {
  useLiveblocksExtension,
} from "@liveblocks/react-tiptap";
import { Threads } from "../../Threads";
import DocumentRuler from "@/components/features/editor/control/DocumentRuler";
import { useCallback, useState, useMemo } from "react";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TableMenu from "@/components/features/editor/control/TableMenu";
import Heading from "@tiptap/extension-heading";
import FloatingMenu from "@/components/common/FloatingMenu";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import ListItem from "@tiptap/extension-list-item";
import Image from "@tiptap/extension-image";
import EmojiPicker from "./control/EmojiPicker";
import { templates } from "@/utils/constant"

const Editor = ({ template }) => {
  const initialContent = useMemo(() => {
    return templates.find(e => e.type === template)?.content;
  }, [template]);

  const liveblocks = useLiveblocksExtension({
    initialContent: initialContent
  });
  const [leftMargin, setLeftMargin] = useState(40);
  const [rightMargin, setRightMargin] = useState(40);
  const [scale, setScale] = useState(1);
  const [previousScale, setPreviousScale] = useState(1);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 })

  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
  });

  const handleMarginChange = useCallback((left, right) => {
    setLeftMargin(left);
    setRightMargin(right);
  }, []);


  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      liveblocks,
      StarterKit.configure({
        history: false,
      }),
      TextStyle,
      Bold,
      Italic,
      Underline,
      FontSizeMark,
      FontFamily,
      Color,
      ZoomExtension,
      Highlight.configure({ multicolor: true }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Heading,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      BulletList,
      OrderedList,
      ListItem,
      TaskList,
      TaskItem.configure({
        nested: true
      }),
      Image,
    ],
    onUpdate: ({ editor }) => {
      const { state, view } = editor
      const { selection } = state
      const { from } = selection

      const textBefore = state.doc.textBetween(Math.max(0, from - 1), from)
      if (textBefore === ':') {
        const coords = view.coordsAtPos(from)
        setPickerPosition({
          left: coords.left,
          top: coords.bottom
        })
        setShowEmojiPicker(true)
      }
    }
  });



  const handleContextMenu = useCallback((event) => {
    // Check if clicking on a table
    const isTableNode = event.target.closest('.tableWrapper');

    if (isTableNode) {
      event.preventDefault();
      setContextMenu({
        show: true,
        x: event.clientX,
        y: event.clientY,
      });
    }
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu({ show: false, x: 0, y: 0 });
  }, []);

  if (!editor) return null;

  return (
    <>
      <div className="flex flex-col gap-12">
        <Toolbar editor={editor} />
        <div className="flex w-full justify-center border min-h-[1400px] mt-20">
          <div className="w-3/4 relative" onContextMenu={handleContextMenu}>
            <div className="absolute -top-[31px] w-full" >
              <DocumentRuler
                editor={editor}
                leftMargin={leftMargin}
                rightMargin={rightMargin}
                onMarginChange={handleMarginChange}
                scale={scale}
                previousScale={previousScale}
              />
            </div>
            <FloatingMenu editor={editor} />
            <EditorContent
              editor={editor}
              className="print-content editor-wrapper min-h-[1200px] pt-20"
              style={{
                paddingLeft: `${leftMargin}px`,
                paddingRight: `${rightMargin}px`,
              }}
            />
            <EmojiPicker
              editor={editor}
              show={showEmojiPicker}
              onHide={() => setShowEmojiPicker(false)}
              position={pickerPosition}
            />
          </div>
        </div>
        {contextMenu.show && (
          <TableMenu
            editor={editor}
            position={{ x: contextMenu.x, y: contextMenu.y }}
            onClose={closeContextMenu}
          />
        )}
        <Threads editor={editor} />
      </div>
    </>
  );
};

export default Editor;
