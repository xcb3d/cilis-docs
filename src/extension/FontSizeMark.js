import { Mark } from "@tiptap/core"


export const FontSizeMark = Mark.create({
  name: 'fontSize',

  addAttributes() {
    return {
      size: {
        default: '16px',
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => ({
          style: `font-size: ${attributes.size}`,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        style: 'font-size',
        getAttrs: value => {
          return {
            size: value,
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0]
  },

  addCommands() {
    return {
      setFontSize: size => ({ commands }) => {
        return commands.setMark(this.name, { size })
      },
      unsetFontSize: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  },
})