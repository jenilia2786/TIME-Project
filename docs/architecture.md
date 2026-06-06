# Guider: Project Architecture & Repository Details

Welcome to the `T.I.M.E` (Guider) repository. This document outlines the structure of the monorepo, explaining the purpose of every major directory and the specific files contained within them.

## High-Level Monorepo Structure

The repository is divided into several isolated environments to ensure clean separation of concerns between the user interface, backend logic, and raw data storage.

```text
T.I.M.E/
├── backend/            # Python API server (FastAPI)
├── frontend/           # Vite React App (UI)
├── data/               # Unified data, Knowledge Base, and Vector DBs
├── scripts/            # Utility and migration scripts
├── docs/               # Project documentation
├── README.md           # Quick start guide
└── .gitignore          # Git exclusion rules
```

---

## 1. `frontend/` (The User Interface)
This directory houses the web application for Guider, built using **React**, **Vite**, and **Tailwind CSS v4**.

- **`package.json` / `package-lock.json`**: Contains the Node.js dependencies, scripts (`npm run dev`, `npm run build`), and package versions.
- **`vite.config.ts`**: The configuration file for Vite, including the React plugin and the new TailwindCSS plugin for extremely fast CSS processing.
- **`src/`**: The core source code for the frontend.
  - **`main.tsx`**: The entry point that mounts the React application to the DOM.
  - **`App.tsx`**: Currently houses the high-fidelity mockups of the Guider **Student Dashboard**. It contains the Sidebar navigation, the soft-gradient main workspace (showing Career Match scores, Skill Progress), and the persistent **Guider AI Side Panel**.
  - **`index.css`**: Contains the Tailwind v4 base layer styles, including the definition of the custom brand colors (Soft Purple, Light Purple) and utility classes like `.soft-gradient` and `.card-shadow`.

---

## 2. `backend/` (The API Server)
This directory is prepared for the Python-based backend that will power the AI reasoning and serve data to the frontend.

- **`requirements.txt`**: A file to track Python dependencies (e.g., `fastapi`, `uvicorn`, `langchain`, `chromadb`).
- **`main.py`**: The entry point for the backend server.
- **`app/`**:
  - **`api/`**: Will contain the REST API endpoints (e.g., `/chat`, `/profile`, `/recommendations`).
  - **`core/`**: For configuration logic, database connections, and security settings.
  - **`models/`**: For database schemas (e.g., Student Profiles, Career Paths).
  - **`services/`**: Contains the heavy business logic, including the RAG (Retrieval-Augmented Generation) engine for the AI Assistant.
- **`tests/`**: A directory for unit and integration tests to ensure backend stability.

---

## 3. `data/` (The Central Intelligence Hub)
This directory is crucial. It holds the raw intelligence and historical data that the AI uses to make career recommendations.

- **`unified_tnea_data.json`**: A master JSON file we created using a Python script. It merged multiple scattered datasets into a single structure containing information for **507 colleges**. Every college entry includes its code, name, physical details (address, principal), and a nested `branches` object detailing cutoffs and allotted seats.
- **`db/`**: Contains the structured databases.
  - **`tnea_structured.db`**: An SQLite relational database containing historical engineering counseling data.
  - **`chroma_db/`**: A vector database used by the AI to perform semantic searches over the knowledge base.
- **`knowledge_base/`**: Previously named `docs`, this folder contains the raw material (PDFs, Word documents, text files) used to feed the RAG pipeline. It acts as the brain for the AI Assistant.
- **`raw_backups/`**: An archive folder where we safely stored the messy, overlapping JSON files (`tnea_cutoff_data_full.json`, `colleges.json`, etc.) after merging them into the unified file.

---

## 4. `scripts/` (Utility Automation)
Scripts used for maintenance and data processing.

- **`merge_data.py`**: The Python script we wrote to parse the old datasets in `data/raw_backups/` and intelligently merge them into `unified_tnea_data.json` by matching college codes and branch data.

---

## 5. Root Configuration
- **`.gitignore`**: Tells Git which files to ignore (like `node_modules`, Python `__pycache__`, and virtual environments).
- **`README.md`**: Provides a quick overview and commands to spin up the frontend and backend locally.
