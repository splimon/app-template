# Intern Assignment: Codebase Optimization & Security Enhancements

## Overview
We want you to get familiar with the **PMF app‑template** codebase and improve it by addressing performance, security, and maintainability concerns. You will use a **coding agent** (Claude Code) to explore the repository, identify problem areas, and implement the required changes.

---

## Objectives
1. **Optimize the session‑validation query** – make the database call more efficient.
2. **Cache session validation with `React.cache()`** – avoid unnecessary round‑trips.
3. **Eliminate code duplication** – refactor repeated logic into reusable helpers.
4. **Add testing infrastructure** – set up unit/integration tests for the new/changed code.
5. **Rate‑limit user registration** – protect the endpoint from abuse.

You should **read through the relevant parts of the codebase first** to understand the existing implementation, then ask the AI to read files for you when needed. The AI can also help you generate the required code.

---

## Suggested Workflow
1. **Explore the repository**
   - Use the coding agent to list files related to authentication, session handling, and registration (e.g., `src/pages/api/auth/*`, `src/services/*`).
   - Ask the agent to *read* those files so you can quickly grasp the current logic.

2. **Identify the optimization opportunities**
   - Prompt the agent:
     ```
     Find the function that validates a user session and show the SQL/ORM query it uses.
     ```
   - Prompt the agent:
     ```
     Suggest a more efficient version of that query (e.g., add indexes, select only needed columns).
     ```

3. **Implement React caching**
   - Prompt the agent:
     ```
     Rewrite the session‑validation logic to use `React.cache()` so the result is memoized on the server.
     ```
   - Verify that the cached function is used by the relevant route components.

4. **Remove duplication**
   - Look for duplicated validation or utility code across files.
   - Prompt the agent:
     ```
     Refactor the duplicated code into a shared helper in `src/lib/auth.ts` and update all callers.
     ```

5. **Add testing infrastructure**
   - Prompt the agent:
     ```
     Scaffold a Jest + React Testing Library setup if not already present, and write tests for the new session‑validation cache and registration rate‑limit.
     ```
   - Ensure `npm test` passes.

6. **Rate‑limit registration**
   - Prompt the agent:
     ```
     Add a rate‑limiting middleware (e.g., using `lru-cache` or `express-rate-limit`) to the registration API endpoint, allowing X attempts per minute.
     ```
   - Write tests that verify the limit is enforced.

---

## Example Prompts for the Coding Agent
Below are ready‑to‑paste prompts you can use with the **coding agent**. Adjust the wording to match the path names in the repository if they differ.

### 1. Locate session validation
```
Find the function that validates a user session in the codebase and show its implementation.
```

### 2. Optimize the query
```
The session validation function runs a database query. Suggest an optimized version of that query (e.g., add proper indexes, select only needed columns).
```

### 3. Add React cache
```
Rewrite the session validation function to be wrapped with `React.cache()` for server‑side caching. Show the updated code and any required imports.
```

### 4. Detect duplicated code
```
Search the repository for duplicated authentication or session‑validation logic and list the files that contain it.
```

### 5. Refactor duplication
```
Create a shared helper `validateSession` in `src/lib/auth.ts` and replace all duplicate implementations with a call to this helper.
```

### 6. Set up testing
```
Generate a Jest configuration (if none exists) and write a test suite for the cached session validation and registration rate limiting.
```

### 7. Add rate limiting
```
Add a rate‑limiting middleware to the registration API (`/api/auth/register`) that allows 5 requests per minute per IP address. Show the middleware implementation and how it is attached to the route.
```

---

## Deliverables
- Updated source files with the optimizations and security enhancements.
- New or updated test files confirming the behavior.
- A short README section (in this assignment file) summarizing the changes you made and any trade‑offs you considered.

---

## Evaluation Criteria
- **Correctness** – The application still works and all tests pass.
- **Performance** – Session validation is faster (you can measure with simple timing logs).
- **Security** – Registration is protected by rate limiting.
- **Code Quality** – No duplicated logic, proper TypeScript typings, and clear commit messages.
- **Testing** – Coverage for the new/changed code.

Good luck, and have fun exploring the codebase with the help of the AI!
