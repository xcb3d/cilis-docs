import { ListTodo } from "lucide-react";
import ToolbarButton from "@/components/common/ToolbarButton";


const TaskList = ({ editor }) => {
  return (
    <ToolbarButton 
      icon={ListTodo}
      label={"Task List"}
      active={editor.isActive('taskList')}
      onClick={() => editor.chain().focus().toggleTaskList().run()}
    />
  )
}

export default TaskList