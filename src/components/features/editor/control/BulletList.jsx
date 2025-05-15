import { List } from "lucide-react";
import ToolbarButton from "@/components/common/ToolbarButton";


const BulletList = ({ editor }) => {
  return (
    <ToolbarButton 
      icon={List}
      label={"Danh sách có dấu đầu dòng"}
      active={editor.isActive('bulletList')}
      onClick={() => editor.chain().focus().toggleBulletList().run()}
    />
  )
}

export default BulletList