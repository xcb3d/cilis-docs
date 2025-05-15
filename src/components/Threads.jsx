import { useThreads } from "@liveblocks/react/suspense";
import {
  AnchoredThreads,
  FloatingComposer,
  FloatingThreads,
} from "@liveblocks/react-tiptap";
import { Thread } from "@liveblocks/react-ui";

export function Threads({ editor }) {
  const { threads } = useThreads();
  return (
    <>
      <div className="anchored-threads">
        <AnchoredThreads editor={editor} threads={threads} />
        {/* {threads.map((thread) => (
        <Thread key={thread.id} thread={thread} className="thread" />
      ))} */}
      </div>
      <FloatingThreads
        editor={editor}
        threads={threads}
        className="floating-threads"
      />
      <FloatingComposer editor={editor} className="floating-composer" />
    </>
  );
}