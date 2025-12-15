# Project-Based Editor Usage Tracking Implementation Plan

## Context
We need to track time spent in code editors and group that usage by the "Project" being worked on.
Simply parsing window titles is unreliable. The chosen approach is to use the **macOS Accessibility API (Option 1)** to retrieve the underlying file path (`AXDocument`) of the active window and then resolve its project root.

## Technical Approach: MacOS Accessibility API
We will use a library that interfaces with macOS Accessibility APIs to fetch active window metadata, specifically the `url` or `path` property associated with the window.

### Dependencies
*   **`active-win`**: A robust Node.js library that uses a bundled Swift binary to query window information. It is preferred over writing custom native bindings to avoid compilation headaches.

## Execution Steps

### Phase 1: Dependencies & Setup
1.  **Install `active-win`** in the Electron app's `main` process (not renderer).
    ```bash
    npm install active-win
    ```
2.  **Permissions:** The Electron app must be granted **Accessibility** permissions in macOS System Settings -> Privacy & Security -> Accessibility.

### Phase 2: Core Logic Implementation

#### 1. The Tracker Service
Create a service that runs on an interval (e.g., every 5-10 seconds) to poll the active window.

```typescript
import activeWin from 'active-win';

async function snapshot() {
  const result = await activeWin();
  if (!result) return;
  // result includes: title, owner.name, url (file path), etc.
}
```

#### 2. Filtering
Only process data if the active app is a known code editor.
*   *Allowlist:* `['Code', 'Cursor', 'WebStorm', 'IntelliJ IDEA', 'Xcode', 'Sublime Text']`

#### 3. Path Resolution
Extract the file path from the window metadata.
*   **Property:** `result.url` (usually file://...) or `result.owner.path`.
*   **Fallback:** If `url` is missing (e.g., "Welcome" screen or unsaved file), fallback to title parsing ONLY if necessary, or categorize as "Unidentified Project".

#### 4. Project Root Discovery (The "Walk-Up" Algorithm)
For a given file path (e.g., `/Users/me/dev/focusd/web/src/main.tsx`), determine the project root.

**Algorithm:**
1.  Start at `dirname(filePath)`.
2.  Check for "Root Indicators" in the current directory:
    *   `.git/` (Directory) - *Highest priority*
    *   `package.json`, `go.mod`, `Cargo.toml`, `pom.xml`, `Gemfile` (Project manifests)
    *   `.editorconfig`
3.  If found -> Return current directory as **Project Root**.
4.  If not found -> Move to parent directory (`../`).
5.  Stop at file system root (`/`) or user home (`~/`).

### Phase 3: Data Aggregation
Store usage data in a structure that allows easy grouping.

```typescript
interface UsageEntry {
  timestamp: number;
  duration: number; // seconds
  appName: string;  // e.g., "VS Code"
  projectRoot: string; // e.g., "/Users/me/dev/focusd"
  projectName: string; // e.g., "focusd" (derived from root folder name)
  activeFile: string; // Optional: detailed file usage
}
```

### Phase 4: Edge Case Handling
*   **Permission Denied:** If `active-win` fails due to permissions, the app should notify the user or degrade gracefully (e.g., fallback to title-only tracking).
*   **Non-File Windows:** Editor settings screens, terminals, or "Welcome" pages often don't have an associated file path. These should be bucketed into the last known project or a generic "General Editor Usage" bucket.

## Next Steps for Developer
1.  Copy this logic into the Electron `main` process.
2.  Implement the `findProjectRoot` utility function using the Node.js `fs` module.
3.  Wire up the polling interval.
