# Enabl Full Stack Blog App

A full-stack blog application built with:

- **Next.js** (Frontend and API Routes)
- **Supabase** (Database and Authentication)
- **C++ via WebAssembly (WASM)** (Word count logic)
- **Tailwind CSS** (Styling)

---

## Live Demo

https://enabl-app-rajamvasaras-projects.vercel.app/

---

## Features

- View paginated list of blog posts
- Create a new post via modal
- View individual post details
- Edit post title and save to Supabase
- Delete posts with confirmation
- Analyze post body using C++ WebAssembly

---

## C++ Integration via WebAssembly

Word count logic is written in 'analyze.cpp', compiled with Emscripten to WebAssembly and used in the frontend for analyzing post bodies.

---

## Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/RajamVasara/enabl-app.git
cd enabl-app
