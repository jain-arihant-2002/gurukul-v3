import { env } from '@/utils/env';
//import { drizzle } from 'drizzle-orm/neon-serverless';// use this for Neon
import { drizzle } from 'drizzle-orm/node-postgres'; // TODO:change this for local Postgres with line 2
import * as schema from '@/db/schema';

export const db = drizzle(env.DATABASE_URL, {
    schema,
    //logger: true, // Enable logging for debugging TODO remove in production

});
{/* This is a Sample Course to Show Website
Welcome to this demo course. This content is designed to showcase the full power of a modern rich text editor used in LMS platforms.

🔹 What You'll Learn
How to write structured content

Use of bold, italic, and combined styles

Creating lists and sub-lists

Embedding media (images, videos, links)

Displaying code blocks

Adding tables and blockquotes

🔠 Headings
Heading Level 3
Heading Level 4
Heading Level 5
✍️ Text Formatting
This is bold text.
This is italic text.
This is strikethrough text.
This is bold and italic text.

📋 Ordered List
Introduction

Getting Started

Advanced Features

Code Blocks

Embedding Media

Conclusion

✅ Unordered List
HTML Basics

CSS Styling

JavaScript Interactivity

Functions

Variables

DOM Manipulation

🔗 Links
Visit the official Gurukul to learn more.

🧮 Code Block
javascript
CopyEdit

function greet(name) { return Hello, ${name}!; } console.log(greet("Student"));

🧾 Table Example
ModuleTopicDuration1Introduction to HTML20 mins2Styling with CSS30 mins3JavaScript Basics45 mins

💬 Blockquote
"Education is the most powerful weapon which you can use to change the world."
— Nelson Mandela

📌 Tip
💡 You can customize your course content using headers, code, tables, and multimedia to create a visually rich learning experience.
*/}