import FontFamily from "./control/FontFamily"
import FontSize from "./control/FontSize"
import Heading from "./control/Heading"
const Functionality = ({ editor }) => {
  return (
    <>
      <Heading editor={editor}/>
      <FontFamily editor={editor}/>
      <FontSize editor={editor}/>
    </>
  )
}

export default Functionality