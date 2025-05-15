export const categories = [
  { title: "Tài liệu trống", template: "empty"},
  { title: "Ghi chú cá nhân", template: "note"},
  { title: "Kế hoạch dự án", template: "project"},
  { title: "Danh sách công việc", template: "timeline"},
  { title: "Bảng thông báo", template: "announcement"},
  { title: "Bài viết blog", template: "blog-post"},
]

export const templates = [
  { type: "empty", content: []},
  { type: "note", content: [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "Ghi Chú Cá Nhân" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Đây là không gian để bạn ghi lại các ý tưởng, kế hoạch và suy nghĩ của mình." }
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
              "content": [{ "type": "text", "text": "Công việc cần làm" }]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Ý tưởng sáng tạo" }]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Lịch trình ngày mai" }]
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
      "content": [{ "type": "text", "text": "Kế Hoạch Dự Án" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Dự án: [Tên dự án]" }
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
              "content": [{ "type": "text", "text": "Mục tiêu dự án" }]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Mốc thời gian quan trọng" }]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Phân công công việc" }]
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
      "content": [{ "type": "text", "text": "Danh Sách Công Việc" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Ngày: [Ngày hiện tại]" }
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
              "content": [{ "type": "text", "text": "Công việc 1" }]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Công việc 2" }]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Công việc 3" }]
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
      "content": [{ "type": "text", "text": "Bảng Thông Báo" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Chào mừng đến với bảng thông báo của chúng tôi!" }
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
              "content": [{ "type": "text", "text": "Thông báo mới" }]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Cập nhật từ đội ngũ" }]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Sự kiện sắp tới" }]
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
      "content": [{ "type": "text", "text": "Bài Viết Blog" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Tiêu đề: [Tiêu đề bài viết]" }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Tóm tắt: [Tóm tắt nội dung bài viết]" }
      ]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Nội dung" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "[Nội dung bài viết]" }
      ]
    }
  ]}
]