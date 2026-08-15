"use client";

import React, { useState, useRef } from "react";
import { FiX, FiSave, FiDownload, FiCopy, FiCheck, FiEye, FiEdit3, FiColumns } from "react-icons/fi";
import styles from "./WikiSection.module.css";
import MarkdownViewer from "./MarkdownViewer";
import { UnifiedProject } from "@/data/projectsData";

interface WikiEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveArticle: (article: {
    id: string;
    projectId: string;
    category: string;
    title: string;
    slug: string;
    content: string;
  }) => void;
  projects: UnifiedProject[];
  initialProjectId?: string;
  initialArticle?: {
    id?: string;
    projectId?: string;
    category?: string;
    title?: string;
    content?: string;
  };
}

export default function WikiEditorModal({
  isOpen,
  onClose,
  onSaveArticle,
  projects,
  initialProjectId,
  initialArticle,
}: WikiEditorModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(
    initialArticle?.projectId || initialProjectId || projects[0]?.id || "project-boss-rpg"
  );
  const [category, setCategory] = useState(initialArticle?.category || "Getting Started");
  const [title, setTitle] = useState(initialArticle?.title || "New Wiki Guide");
  const [content, setContent] = useState(
    initialArticle?.content ||
      `# Getting Started Guide

Write your professional Markdown documentation here.

> [!NOTE]
> Add important notes or callouts for your community.

## Installation Steps

1. Step 1: Download the release.
2. Step 2: Install dependencies.

\`\`\`bash
# Run command
npm run start
\`\`\`
`
  );

  const [editorViewMode, setEditorViewMode] = useState<"write" | "split" | "preview">("split");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!isOpen) return null;

  // Insert markdown snippet at cursor position
  const insertSnippet = (before: string, after: string = "") => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${before}${selectedText || "text"}${after}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + before.length, start + before.length + (selectedText.length || 4));
      }
    }, 50);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const articleId = initialArticle?.id || `custom-${Date.now()}`;
    onSaveArticle({
      id: articleId,
      projectId: selectedProjectId,
      category: category.trim() || "Guides",
      title: title.trim(),
      slug,
      content,
    });
    onClose();
  };

  const handleExportMd = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "wiki-article"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMd = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.editorOverlay} onClick={onClose}>
      <div className={styles.editorContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header Bar */}
        <div className={styles.editorHeader}>
          <div className={styles.editorHeaderTitle}>
            <FiEdit3 size={18} color="#64d2ff" />
            <span>WIKI MARKDOWN EDITOR</span>
          </div>

          <div className={styles.editorHeaderActions}>
            {/* View Mode Selector */}
            <div className={styles.viewSegmentedControl}>
              <button
                className={`${styles.viewSegBtn} ${editorViewMode === "write" ? styles.viewSegBtnActive : ""}`}
                onClick={() => setEditorViewMode("write")}
              >
                <FiEdit3 size={13} /> Write
              </button>
              <button
                className={`${styles.viewSegBtn} ${editorViewMode === "split" ? styles.viewSegBtnActive : ""}`}
                onClick={() => setEditorViewMode("split")}
              >
                <FiColumns size={13} /> Split
              </button>
              <button
                className={`${styles.viewSegBtn} ${editorViewMode === "preview" ? styles.viewSegBtnActive : ""}`}
                onClick={() => setEditorViewMode("preview")}
              >
                <FiEye size={13} /> Preview
              </button>
            </div>

            <button className={styles.editorCloseBtn} onClick={onClose}>
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Metadata Controls */}
        <div className={styles.editorMetaRow}>
          <div className={styles.metaField}>
            <label>PROJECT:</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className={styles.metaSelect}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.metaField}>
            <label>CATEGORY:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Getting Started, Guides, API"
              className={styles.metaInput}
            />
          </div>

          <div className={styles.metaFieldFlex}>
            <label>ARTICLE TITLE:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title..."
              className={styles.metaInput}
            />
          </div>
        </div>

        {/* Editor Quick Toolbar */}
        <div className={styles.editorToolbar}>
          <button onClick={() => insertSnippet("# ", "")} title="Heading 1">H1</button>
          <button onClick={() => insertSnippet("## ", "")} title="Heading 2">H2</button>
          <button onClick={() => insertSnippet("### ", "")} title="Heading 3">H3</button>
          <div className={styles.toolDivider} />
          <button onClick={() => insertSnippet("**", "**")} title="Bold"><strong>B</strong></button>
          <button onClick={() => insertSnippet("*", "*")} title="Italic"><em>I</em></button>
          <button onClick={() => insertSnippet("`", "`")} title="Inline Code">Code</button>
          <button onClick={() => insertSnippet("```bash\n", "\n```")} title="Code Block">``` Block</button>
          <div className={styles.toolDivider} />
          <button onClick={() => insertSnippet("> [!NOTE]\n> ", "")} title="Note Alert">ℹ️ Note</button>
          <button onClick={() => insertSnippet("> [!TIP]\n> ", "")} title="Tip Alert">💡 Tip</button>
          <button onClick={() => insertSnippet("> [!WARNING]\n> ", "")} title="Warning Alert">⚠️ Warning</button>
          <button onClick={() => insertSnippet("> [!IMPORTANT]\n> ", "")} title="Important Alert">🚨 Important</button>
          <div className={styles.toolDivider} />
          <button onClick={() => insertSnippet("| Header 1 | Header 2 |\n|---|---|\n| Cell 1 | Cell 2 |", "")} title="Table">📊 Table</button>
          <button onClick={() => insertSnippet("- ", "")} title="List item">• List</button>
          <button onClick={() => insertSnippet("[Link Text](", ")")} title="Hyperlink">🔗 Link</button>
        </div>

        {/* Body Split Container */}
        <div className={styles.editorBody}>
          {(editorViewMode === "write" || editorViewMode === "split") && (
            <div className={styles.editorPaneTextarea}>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your markdown content here..."
                className={styles.rawTextarea}
              />
            </div>
          )}

          {(editorViewMode === "preview" || editorViewMode === "split") && (
            <div className={styles.editorPanePreview}>
              <MarkdownViewer content={content} />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={styles.editorFooter}>
          <div className={styles.leftFooterBtns}>
            <button onClick={handleCopyMd} className={styles.secondaryBtn}>
              {copied ? <FiCheck color="#30d158" size={14} /> : <FiCopy size={14} />}
              <span>{copied ? "Copied!" : "Copy Markdown"}</span>
            </button>
            <button onClick={handleExportMd} className={styles.secondaryBtn}>
              <FiDownload size={14} />
              <span>Export .md File</span>
            </button>
          </div>

          <div className={styles.rightFooterBtns}>
            <button onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button onClick={handleSave} className={styles.saveBtn}>
              <FiSave size={15} />
              <span>Save & Publish Wiki</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
