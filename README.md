# Calis Docs

A real-time collaborative document editor that enables seamless co-authoring and content creation.

## Features

- **Real-time Collaboration**: Multiple users can edit documents simultaneously with real-time cursor presence and updates.
- **Rich Text Editing**: Comprehensive text formatting, tables, lists, task lists, headings, and more.
- **Image Support**: Insert and manipulate images within documents.
- **Document Templates**: Start from various templates for different use cases.
- **Document Management**: Create, view, and manage your documents.
- **User Authentication**: Secure user authentication through Clerk.
- **Access Control**: Control who can view and edit your documents.
- **Commenting & Discussions**: Thread-based commenting system for discussions within documents.

## Technology Stack

- **Frontend**:
  - Next.js 14 (React framework)
  - TipTap (Rich text editor)
  - Tailwind CSS (Styling)
  - Framer Motion (Animations)

- **Collaboration**:
  - Liveblocks (Real-time collaboration)
  - Yjs (CRDT for text editing)

- **Backend**:
  - Next.js API Routes
  - MongoDB (Document storage)
  - Clerk (Authentication)

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/xcb3d/calis-docs.git
   cd calis-docs
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string
   
   # Liveblocks
   LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key
   NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=your_liveblocks_public_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Sign in with your account
2. Create a new document from the available templates
3. Start editing and invite collaborators to join
4. Use the toolbar to format text, add tables, and more
5. Comments can be added to specific parts of the document