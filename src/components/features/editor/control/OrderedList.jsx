import { ListOrdered } from "lucide-react";
import ToolbarButton from "@/components/common/ToolbarButton";


const OrderedList = ({ editor }) => {
  return (
    <ToolbarButton 
      icon={ListOrdered}
      label={"Ordered list"}
      active={editor.isActive('orderedList')}
      onClick={() => editor.chain().focus().toggleOrderedList().run()}
    />
  )
}

export default OrderedList