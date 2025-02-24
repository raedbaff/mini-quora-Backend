# mini-quora-Backend
## Mini Quora
- A Q&A platform powered by Prisma and MongoDB.

### Overview
This project implements a Q&A application where users can ask questions, provide answers, and interact via upvotes, downvotes, and replies. It leverages Prisma as an ORM and MongoDB as the database, ensuring efficient data management and scalability.

### Technologies
- Prisma – ORM for defining and interacting with your database schema.
- MongoDB – NoSQL database used as the data store.
- Nest js / TypeScript – Backend implementation.

### Data Models
#### User
- id: Unique identifier.
- email: Unique email address.
- username: Optional username.
- password: Encrypted password.
- role: Either USER or ADMIN (default: USER).
- profilePic: Optional profile picture URL.
- level: User level (default: 1).
- isBanned: Boolean flag for bans.
- banExpiresAt & banReason: Ban details.
- Relations: Has many questions, answers, upvotes, downvotes, and replies.
- Timestamps: createdAt and updatedAt.

#### Question
- id: Unique identifier.
- title & description: Content of the question.
- user: The user who asked the question.
- Relations: Has many answers, upvotes, downvotes.
- tags: An array of tags (e.g., TECHNOLOGY, HEALTH, etc.).
- Counters: Number of answers, upvotes, and downvotes.
- Timestamps: createdAt and updatedAt.

#### Answer
- id: Unique identifier.
- description: Content of the answer.
- user: The user who answered.
- question: The related question.
- Relations: Has many upvotes, downvotes, and replies.
- Counters: Number of upvotes, downvotes, and replies.
- Timestamps: createdAt and updatedAt.
- Upvote / DownVote
- id: Unique identifier.
- user: The user who voted.
- Relations: Optionally related to a question or an answer.
- Timestamps: createdAt and updatedAt.

#### Reply
- id: Unique identifier.
- description: Content of the reply.
- user: The user who replied.
- answer: The related answer.
- Timestamps: createdAt and updatedAt.

#### Enums
- Role: USER, ADMIN
- Tag: A predefined list including TECHNOLOGY, PROGRAMMING, SCIENCE, HEALTH, EDUCATION, BUSINESS, FINANCE, SPORTS, ENTERTAINMENT, LIFESTYLE, TRAVEL, FOOD, HISTORY, POLITICS, PHILOSOPHY, RELIGION, ART, BOOKS, MUSIC, MOVIES, GAMING, RELATIONSHIPS, CAREER, SELF_IMPROVEMENT, STARTUPS, LAW, ENVIRONMENT, RANDOM
