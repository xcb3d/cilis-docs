// extension/CommentExtension.js
import { Mark } from '@tiptap/core'

export default Mark.create({
  name: 'comment',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-comment-id]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', {
      ...HTMLAttributes,
      class: `comment-mark ${HTMLAttributes.class || ''}`
    }, 0]
  },

  addAttributes() {
    return {
      commentId: {
        default: null,
        parseHTML: element => element.getAttribute('data-comment-id'),
        renderHTML: attributes => {
          if (!attributes.commentId) {
            return {}
          }

          return {
            'data-comment-id': attributes.commentId,
          }
        },
      },
    }
  },

  addCommands() {
    return {
      setComment: commentId => ({ chain }) => {
        return chain().setMark('comment', { commentId }).run()
      },
      unsetComment: commentId => ({ chain }) => {
        return chain().unsetMark('comment').run()
      },
    }
  },
})
