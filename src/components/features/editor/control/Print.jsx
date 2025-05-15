import ToolbarButton from "@/components/common/ToolbarButton";
import { IoPrintOutline } from "react-icons/io5";

const Print = ({ editor }) => {
  return (
    <ToolbarButton
      icon={IoPrintOutline}
      label="In"
      // active={true}
      onClick={() => window.print()}
    />
  );
};

export default Print;
