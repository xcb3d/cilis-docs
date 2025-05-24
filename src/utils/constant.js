export const categories = [
  { title: "Empty Document", template: "empty"},
  { title: "Personal Notes", template: "note"},
  { title: "Project Plan", template: "project"},
  { title: "Task List", template: "timeline"},
  { title: "Announcement Board", template: "announcement"},
  { title: "Blog Post", template: "blog-post"},
]

export const templates = [
  { type: "empty", content: []},
  { type: "note", content: [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "Personal Notes" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "This is a space for you to write down your ideas, plans and thoughts." }
      ]
    },
    {
      "type": "bulletList",
      "content": [
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Tasks to do" }]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Creative ideas" }]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Tomorrow's schedule" }]
            }
          ]
        }
      ]
    }
  ]},
  { type: "project", content: [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "Project Plan" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Project: [Project name]" }
      ]
    },
    {
      "type": "orderedList",
      "content": [
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Project objectives" }]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Important milestones" }]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Task assignments" }]
            }
          ]
        }
      ]
    }
  ]},
  { type: "timeline", content: [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "Task List" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Date: [Current date]" }
      ]
    },
    {
      "type": "bulletList",
      "content": [
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Task 1" }]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Task 2" }]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Task 3" }]
            }
          ]
        }
      ]
    }
  ]},
  { type: "announcement", content: [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "Announcement Board" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Welcome to our announcement board!" }
      ]
    },
    {
      "type": "bulletList",
      "content": [
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "New announcements" }]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Team updates" }]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Upcoming events" }]
            }
          ]
        }
      ]
    }
  ]},
  { type: "blog-post", content: [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "Blog Post" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Title: [Post title]" }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Summary: [Post summary]" }
      ]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Content" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "[Post content]" }
      ]
    }
  ]}
]