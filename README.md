# Building an AI-Powered Doubt Solver for Students (AI Doubt Solver)

## The Problem
You are studying late at night and a doubt pops up. Maybe it's a math equation, a chemistry diagram from your textbook, or a tricky physics question. There's no teacher around. Your friends are asleep. Google gives you ten irrelevant articles instead of an answer.

## The Help-When-You-Need-It Gap
Having a doubt != Getting it solved.

Here is what every student experiences: doubts arise at the worst times - late at night, during weekends, in the middle of self-study. Books don't answer back. Search engines bury the answer under ads. Asking a teacher means waiting until tomorrow, and asking a friend means hoping they actually know.

Most students drop a doubt within 10 minutes if they can't get a clear answer, and a dropped doubt becomes a knowledge gap that snowballs into bigger problems later.

## Traditional Approaches and Their Limitations
| Approach | Limitation |
|---|---|
| Searching online | Ads, irrelevant results, no step-by-step explanation |
| Asking a teacher | Only available during class hours |
| Asking friends | They may be stuck on the same doubt |
| Private tuition | Expensive, fixed schedule |
| Generic chatbots | Don't understand images, no academic context |

## The Solution: AI-Powered Doubt Solvers
What if you could just describe your doubt - by typing, taking a photo, or even speaking it - and get a clear, step-by-step explanation in seconds?

AI-powered doubt solvers do exactly that:
- Accept doubts as text, image, or voice
- Use a large language model to generate step-by-step explanations like a real tutor
- Save chat history so students can revisit past doubts
- Detect the subject automatically and tailor the answer
- Are available 24/7 - no waiting, no judgement

## Real World AI Tutor Platforms
- Khanmigo (Khan Academy) - https://www.khanmigo.ai
- Photomath - https://photomath.com
- Socratic by Google - https://socratic.org
- Quizlet Q-Chat - https://quizlet.com
- ChatGPT - https://chat.openai.com

## What We Will Build
### AI Doubt Solver - A Full-Stack AI Tutor for Students
In this session, we'll build a full-stack application where students ask doubts in three different ways - text, image, or voice - and get instant AI-generated explanations. Every conversation is saved so students can review past doubts anytime.

## Key Features
| Feature | Description |
|---|---|
| User Authentication | Secure register and login with JWT tokens and bcrypt password hashing |
| Multi-Modal Doubts | Ask doubts as text, upload an image, or record your voice |
| AI Explanations | Step-by-step answers powered by Groq's LLaMA 3.3 70B model |
| Image Analysis | Photos of textbook problems, diagrams, or equations are analyzed by LLaMA 4 Scout Vision |
| Voice Transcription | Recorded audio is converted to text using AssemblyAI |
| Chat History | Every conversation is saved to MongoDB and grouped by subject |
| Subject Auto-Detection | The app guesses the subject (Math, Physics, Chemistry, etc.) from your question |
| Markdown Answers | AI responses render with headings, bullet points, and code |

## High-Level Architecture
```text
Frontend (React + Vite)             Backend (Express + MongoDB)
-------------------------           --------------------------------
| Landing Page          |           |                              |
| Login / Register      |--POST---> | /api/auth/register          |
|                       |--POST---> | /api/auth/login -> JWT      |
|                       |           |                              |
| Dashboard             |--GET----> | /api/chats                  |
| (Chat list + stats)   |--POST---> | /api/chats -> Create        |
|                       |--DELETE-> | /api/chats/:id -> Delete    |
|                       |           |                              |
| Chat Page             |--POST---> | /api/chats/:id/text         |
| (Text/Image/Voice)    |--POST---> | /api/chats/:id/image        |
|                       |--POST---> | /api/chats/:id/voice        |
+-----------------------+           |            |                 |
                                    +------------|-----------------+
                                                 |
                                  +--------------|--------------+
                                  v              v              v
                          +------------+ +------------+ +-------------+
                          | MongoDB    | | Groq AI    | | AssemblyAI  |
                          | (Users +   | | (LLaMA 3.3 | | (Speech-to- |
                          |  Chats)    | |  + Vision) | |  Text)      |
                          +------------+ +------------+ +-------------+
```
