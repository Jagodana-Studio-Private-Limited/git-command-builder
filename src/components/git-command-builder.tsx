"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, GitBranch, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ToolEvents } from "@/lib/analytics";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface Flag {
  flag: string;
  label: string;
  description: string;
  type: "boolean" | "string";
  placeholder?: string;
}

interface Operation {
  name: string;
  base: string;
  emoji: string;
  description: string;
  flags: Flag[];
  positionalLabel?: string;
  positionalPlaceholder?: string;
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const operations: Operation[] = [
  {
    name: "commit",
    base: "git commit",
    emoji: "💾",
    description: "Record changes to the repository",
    positionalLabel: "Files (optional)",
    positionalPlaceholder: "file1.ts file2.ts",
    flags: [
      { flag: "-m", label: "Message", description: "Commit message", type: "string", placeholder: "feat: add new feature" },
      { flag: "--amend", label: "Amend", description: "Amend the last commit", type: "boolean" },
      { flag: "--no-edit", label: "No Edit", description: "Use the previous commit message (with --amend)", type: "boolean" },
      { flag: "-a", label: "All", description: "Stage all modified and deleted files", type: "boolean" },
      { flag: "--allow-empty", label: "Allow Empty", description: "Allow an empty commit", type: "boolean" },
      { flag: "-S", label: "Sign", description: "GPG-sign the commit", type: "boolean" },
      { flag: "--fixup", label: "Fixup", description: "Create a fixup commit for autosquash", type: "string", placeholder: "<commit-hash>" },
    ],
  },
  {
    name: "branch",
    base: "git branch",
    emoji: "🌿",
    description: "List, create, or delete branches",
    positionalLabel: "Branch name",
    positionalPlaceholder: "feature/my-branch",
    flags: [
      { flag: "-d", label: "Delete", description: "Delete a fully-merged branch", type: "boolean" },
      { flag: "-D", label: "Force Delete", description: "Force-delete a branch (even if unmerged)", type: "boolean" },
      { flag: "-m", label: "Rename", description: "Rename the current branch", type: "string", placeholder: "new-name" },
      { flag: "-a", label: "All", description: "List both local and remote branches", type: "boolean" },
      { flag: "-r", label: "Remote", description: "List remote-tracking branches", type: "boolean" },
      { flag: "-v", label: "Verbose", description: "Show branch + last commit", type: "boolean" },
      { flag: "--merged", label: "Merged", description: "List branches already merged into HEAD", type: "boolean" },
    ],
  },
  {
    name: "checkout",
    base: "git checkout",
    emoji: "🔀",
    description: "Switch branches or restore working tree files",
    positionalLabel: "Branch or file",
    positionalPlaceholder: "main",
    flags: [
      { flag: "-b", label: "New Branch", description: "Create and switch to a new branch", type: "string", placeholder: "new-branch" },
      { flag: "--track", label: "Track", description: "Set up tracking for a remote branch", type: "boolean" },
      { flag: "--orphan", label: "Orphan", description: "Create a new orphan branch", type: "string", placeholder: "branch-name" },
      { flag: "-f", label: "Force", description: "Force checkout (discard local changes)", type: "boolean" },
      { flag: "--", label: "Separator", description: "Treat remaining args as file paths", type: "boolean" },
    ],
  },
  {
    name: "merge",
    base: "git merge",
    emoji: "🔗",
    description: "Join two or more development histories",
    positionalLabel: "Branch to merge",
    positionalPlaceholder: "feature/branch",
    flags: [
      { flag: "--no-ff", label: "No Fast-Forward", description: "Always create a merge commit", type: "boolean" },
      { flag: "--ff-only", label: "FF Only", description: "Refuse to merge unless fast-forward is possible", type: "boolean" },
      { flag: "--squash", label: "Squash", description: "Squash all commits into one (no merge commit)", type: "boolean" },
      { flag: "--abort", label: "Abort", description: "Abort the current merge", type: "boolean" },
      { flag: "--no-commit", label: "No Commit", description: "Merge but don't auto-commit", type: "boolean" },
      { flag: "-m", label: "Message", description: "Custom merge commit message", type: "string", placeholder: "Merge feature into main" },
    ],
  },
  {
    name: "rebase",
    base: "git rebase",
    emoji: "📐",
    description: "Reapply commits on top of another base tip",
    positionalLabel: "Onto branch",
    positionalPlaceholder: "main",
    flags: [
      { flag: "-i", label: "Interactive", description: "Start an interactive rebase", type: "boolean" },
      { flag: "--onto", label: "Onto", description: "Rebase onto a specific branch", type: "string", placeholder: "target-branch" },
      { flag: "--abort", label: "Abort", description: "Abort the current rebase", type: "boolean" },
      { flag: "--continue", label: "Continue", description: "Continue after resolving conflicts", type: "boolean" },
      { flag: "--skip", label: "Skip", description: "Skip the current patch", type: "boolean" },
      { flag: "--autosquash", label: "Autosquash", description: "Auto-squash fixup commits", type: "boolean" },
    ],
  },
  {
    name: "cherry-pick",
    base: "git cherry-pick",
    emoji: "🍒",
    description: "Apply the changes from specific commits",
    positionalLabel: "Commit hash(es)",
    positionalPlaceholder: "abc1234",
    flags: [
      { flag: "--no-commit", label: "No Commit", description: "Apply changes but don't commit", type: "boolean" },
      { flag: "-x", label: "Append Hash", description: "Append '(cherry picked from ...)' to the message", type: "boolean" },
      { flag: "--abort", label: "Abort", description: "Abort the current cherry-pick", type: "boolean" },
      { flag: "--continue", label: "Continue", description: "Continue after resolving conflicts", type: "boolean" },
      { flag: "-e", label: "Edit", description: "Edit the commit message before committing", type: "boolean" },
    ],
  },
  {
    name: "stash",
    base: "git stash",
    emoji: "📦",
    description: "Stash changes in the working directory",
    flags: [
      { flag: "push", label: "Push", description: "Stash changes (default action)", type: "boolean" },
      { flag: "pop", label: "Pop", description: "Apply and remove the latest stash", type: "boolean" },
      { flag: "apply", label: "Apply", description: "Apply the latest stash (keep in stash list)", type: "boolean" },
      { flag: "list", label: "List", description: "List all stash entries", type: "boolean" },
      { flag: "drop", label: "Drop", description: "Remove a stash entry", type: "boolean" },
      { flag: "-u", label: "Include Untracked", description: "Also stash untracked files", type: "boolean" },
      { flag: "-m", label: "Message", description: "Stash message", type: "string", placeholder: "WIP: fixing auth" },
    ],
  },
  {
    name: "reset",
    base: "git reset",
    emoji: "⏪",
    description: "Reset HEAD to a specified state",
    positionalLabel: "Commit / ref",
    positionalPlaceholder: "HEAD~1",
    flags: [
      { flag: "--soft", label: "Soft", description: "Keep changes staged", type: "boolean" },
      { flag: "--mixed", label: "Mixed", description: "Unstage changes but keep in working tree (default)", type: "boolean" },
      { flag: "--hard", label: "Hard", description: "Discard all changes (dangerous!)", type: "boolean" },
    ],
  },
  {
    name: "log",
    base: "git log",
    emoji: "📜",
    description: "Show commit history",
    flags: [
      { flag: "--oneline", label: "One Line", description: "Show each commit on one line", type: "boolean" },
      { flag: "--graph", label: "Graph", description: "Show ASCII graph of branch structure", type: "boolean" },
      { flag: "--all", label: "All", description: "Show all branches", type: "boolean" },
      { flag: "--stat", label: "Stats", description: "Show file change statistics", type: "boolean" },
      { flag: "-n", label: "Limit", description: "Number of commits to show", type: "string", placeholder: "10" },
      { flag: "--author", label: "Author", description: "Filter by author", type: "string", placeholder: "name@email.com" },
      { flag: "--since", label: "Since", description: "Show commits after a date", type: "string", placeholder: "2024-01-01" },
      { flag: "--pretty", label: "Format", description: "Pretty-print format", type: "string", placeholder: "format:%h %s" },
    ],
  },
  {
    name: "diff",
    base: "git diff",
    emoji: "🔍",
    description: "Show changes between commits, working tree, etc.",
    positionalLabel: "Ref / file",
    positionalPlaceholder: "HEAD~1",
    flags: [
      { flag: "--staged", label: "Staged", description: "Show changes staged for the next commit", type: "boolean" },
      { flag: "--stat", label: "Stats", description: "Show diffstat instead of patch", type: "boolean" },
      { flag: "--name-only", label: "Names Only", description: "Show only changed file names", type: "boolean" },
      { flag: "--name-status", label: "Name + Status", description: "Show file names and modification type", type: "boolean" },
      { flag: "--color-words", label: "Color Words", description: "Word-level diff with color", type: "boolean" },
      { flag: "-w", label: "Ignore Whitespace", description: "Ignore all whitespace changes", type: "boolean" },
    ],
  },
  {
    name: "tag",
    base: "git tag",
    emoji: "🏷️",
    description: "Create, list, or delete tags",
    positionalLabel: "Tag name",
    positionalPlaceholder: "v1.0.0",
    flags: [
      { flag: "-a", label: "Annotated", description: "Create an annotated tag", type: "boolean" },
      { flag: "-m", label: "Message", description: "Tag message (with -a)", type: "string", placeholder: "Release v1.0.0" },
      { flag: "-d", label: "Delete", description: "Delete a tag", type: "boolean" },
      { flag: "-l", label: "List", description: "List tags matching a pattern", type: "string", placeholder: "v1.*" },
      { flag: "-f", label: "Force", description: "Replace an existing tag", type: "boolean" },
    ],
  },
  {
    name: "clean",
    base: "git clean",
    emoji: "🧹",
    description: "Remove untracked files from the working tree",
    flags: [
      { flag: "-n", label: "Dry Run", description: "Show what would be removed", type: "boolean" },
      { flag: "-f", label: "Force", description: "Actually remove untracked files", type: "boolean" },
      { flag: "-d", label: "Directories", description: "Also remove untracked directories", type: "boolean" },
      { flag: "-x", label: "Ignored Too", description: "Also remove ignored files", type: "boolean" },
      { flag: "-X", label: "Only Ignored", description: "Remove only ignored files", type: "boolean" },
      { flag: "-i", label: "Interactive", description: "Interactive mode", type: "boolean" },
    ],
  },
  {
    name: "remote",
    base: "git remote",
    emoji: "🌐",
    description: "Manage remote repositories",
    flags: [
      { flag: "-v", label: "Verbose", description: "Show URLs for each remote", type: "boolean" },
      { flag: "add", label: "Add", description: "Add a new remote", type: "string", placeholder: "origin https://..." },
      { flag: "remove", label: "Remove", description: "Remove a remote", type: "string", placeholder: "origin" },
      { flag: "rename", label: "Rename", description: "Rename a remote", type: "string", placeholder: "old-name new-name" },
      { flag: "set-url", label: "Set URL", description: "Change a remote's URL", type: "string", placeholder: "origin https://..." },
    ],
  },
  {
    name: "fetch",
    base: "git fetch",
    emoji: "📥",
    description: "Download objects and refs from a remote",
    positionalLabel: "Remote",
    positionalPlaceholder: "origin",
    flags: [
      { flag: "--all", label: "All", description: "Fetch all remotes", type: "boolean" },
      { flag: "--prune", label: "Prune", description: "Remove remote-tracking refs that no longer exist", type: "boolean" },
      { flag: "--tags", label: "Tags", description: "Fetch all tags", type: "boolean" },
      { flag: "--depth", label: "Depth", description: "Limit fetching to a specific depth", type: "string", placeholder: "1" },
    ],
  },
  {
    name: "pull",
    base: "git pull",
    emoji: "⬇️",
    description: "Fetch from and integrate with a remote branch",
    positionalLabel: "Remote + branch",
    positionalPlaceholder: "origin main",
    flags: [
      { flag: "--rebase", label: "Rebase", description: "Rebase instead of merge", type: "boolean" },
      { flag: "--no-rebase", label: "No Rebase", description: "Force merge (override config)", type: "boolean" },
      { flag: "--ff-only", label: "FF Only", description: "Only update if fast-forward is possible", type: "boolean" },
      { flag: "--no-commit", label: "No Commit", description: "Merge but don't auto-commit", type: "boolean" },
      { flag: "--autostash", label: "Autostash", description: "Stash and restore local changes automatically", type: "boolean" },
    ],
  },
  {
    name: "push",
    base: "git push",
    emoji: "⬆️",
    description: "Update remote refs along with associated objects",
    positionalLabel: "Remote + branch",
    positionalPlaceholder: "origin main",
    flags: [
      { flag: "-u", label: "Set Upstream", description: "Set upstream tracking reference", type: "boolean" },
      { flag: "--force", label: "Force", description: "Force push (dangerous!)", type: "boolean" },
      { flag: "--force-with-lease", label: "Force with Lease", description: "Safer force push — refuses if remote was updated", type: "boolean" },
      { flag: "--tags", label: "Tags", description: "Push all tags", type: "boolean" },
      { flag: "--delete", label: "Delete", description: "Delete a remote branch", type: "boolean" },
      { flag: "--dry-run", label: "Dry Run", description: "Show what would be pushed", type: "boolean" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function GitCommandBuilder() {
  const [selectedOp, setSelectedOp] = useState<string>("commit");
  const [flagState, setFlagState] = useState<Record<string, boolean | string>>({});
  const [positional, setPositional] = useState("");
  const [copied, setCopied] = useState(false);

  const op = useMemo(
    () => operations.find((o) => o.name === selectedOp)!,
    [selectedOp]
  );

  const command = useMemo(() => {
    const parts: string[] = [op.base];

    for (const f of op.flags) {
      const val = flagState[f.flag];
      if (!val) continue;
      if (f.type === "boolean" && val === true) {
        // For stash sub-commands (push/pop/apply/list/drop), add without dash
        if (op.name === "stash" && !f.flag.startsWith("-")) {
          parts.splice(1, 0, f.flag); // insert after "git stash"
        } else {
          parts.push(f.flag);
        }
      } else if (f.type === "string" && typeof val === "string" && val.trim()) {
        // For remote sub-commands, add without dash
        if (op.name === "remote" && !f.flag.startsWith("-")) {
          parts.push(f.flag, val.trim());
        } else if (f.flag === "-m") {
          parts.push(f.flag, `"${val.trim()}"`);
        } else if (f.flag === "--pretty") {
          parts.push(`${f.flag}=${val.trim()}`);
        } else {
          parts.push(f.flag, val.trim());
        }
      }
    }

    if (positional.trim()) {
      parts.push(positional.trim());
    }

    return parts.join(" ");
  }, [op, flagState, positional]);

  const handleSelectOp = useCallback((name: string) => {
    setSelectedOp(name);
    setFlagState({});
    setPositional("");
  }, []);

  const handleToggle = useCallback((flag: string, checked: boolean) => {
    setFlagState((prev) => ({ ...prev, [flag]: checked }));
  }, []);

  const handleStringChange = useCallback((flag: string, value: string) => {
    setFlagState((prev) => ({ ...prev, [flag]: value }));
  }, []);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    toast.success("Command copied to clipboard!");
    ToolEvents.resultCopied();
    setTimeout(() => setCopied(false), 2000);
  }, [command]);

  const handleReset = useCallback(() => {
    setFlagState({});
    setPositional("");
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Command Preview - sticky at the top */}
      <Card className="p-4 border-brand/30 bg-muted/40 sticky top-20 z-10 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <GitBranch className="h-4 w-4 text-brand shrink-0" />
            <code className="text-sm sm:text-base font-mono text-foreground break-all">
              {command}
            </code>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              aria-label="Reset options"
              className="h-8 w-8"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleCopy}
              className="gap-1.5 bg-gradient-to-r from-brand to-brand-accent text-white"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-[240px_1fr] gap-6">
        {/* Operation list */}
        <Card className="p-0 overflow-hidden">
          <div className="p-3 border-b border-border/50">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Operations
            </h3>
          </div>
          <ScrollArea className="h-[520px]">
            <div className="p-2 space-y-0.5">
              {operations.map((o) => (
                <button
                  key={o.name}
                  onClick={() => handleSelectOp(o.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedOp === o.name
                      ? "bg-brand/10 text-brand border border-brand/20"
                      : "hover:bg-muted/60 text-foreground"
                  }`}
                >
                  <span className="text-base">{o.emoji}</span>
                  <span>git {o.name}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Options panel */}
        <Card className="p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{op.emoji}</span>
              <h3 className="text-lg font-bold">git {op.name}</h3>
              <Badge variant="secondary" className="ml-auto text-xs">
                {op.flags.length} options
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{op.description}</p>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            {/* Positional argument */}
            {op.positionalLabel && (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  {op.positionalLabel}
                </Label>
                <Input
                  value={positional}
                  onChange={(e) => setPositional(e.target.value)}
                  placeholder={op.positionalPlaceholder}
                  className="font-mono text-sm"
                />
              </div>
            )}

            {/* Flags */}
            {op.flags.map((f) => (
              <div key={f.flag} className="space-y-1.5">
                {f.type === "boolean" ? (
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={`flag-${op.name}-${f.flag}`}
                      checked={flagState[f.flag] === true}
                      onCheckedChange={(checked) =>
                        handleToggle(f.flag, checked === true)
                      }
                      className="mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <Label
                        htmlFor={`flag-${op.name}-${f.flag}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        <code className="text-brand font-mono text-xs mr-1.5">
                          {f.flag}
                        </code>
                        {f.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {f.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">
                      <code className="text-brand font-mono text-xs mr-1.5">
                        {f.flag}
                      </code>
                      {f.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {f.description}
                    </p>
                    <Input
                      value={
                        typeof flagState[f.flag] === "string"
                          ? (flagState[f.flag] as string)
                          : ""
                      }
                      onChange={(e) =>
                        handleStringChange(f.flag, e.target.value)
                      }
                      placeholder={f.placeholder}
                      className="font-mono text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
