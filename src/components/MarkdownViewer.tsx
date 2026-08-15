"use client";

import React, { useState } from "react";
import { FiCopy, FiCheck, FiInfo, FiAlertCircle, FiAlertTriangle, FiHelpCircle } from "react-icons/fi";
import styles from "./WikiSection.module.css";

interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(idx);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Helper to parse inline styles (**bold**, *italic*, `code`, [link](url))
  const renderInline = (text: string) => {
    const parts: React.ReactNode[] = [];
    // Regex for bold, italic, code, link
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const raw = match[0];
      if (raw.startsWith("**") && raw.endsWith("**")) {
        parts.push(<strong key={match.index}>{raw.slice(2, -2)}</strong>);
      } else if (raw.startsWith("*") && raw.endsWith("*")) {
        parts.push(<em key={match.index}>{raw.slice(1, -1)}</em>);
      } else if (raw.startsWith("`") && raw.endsWith("`")) {
        parts.push(<code key={match.index} className={styles.inlineCode}>{raw.slice(1, -1)}</code>);
      } else if (raw.startsWith("[")) {
        const linkText = raw.substring(1, raw.indexOf("]"));
        const linkUrl = raw.substring(raw.indexOf("(") + 1, raw.length - 1);
        parts.push(
          <a key={match.index} href={linkUrl} target="_blank" rel="noreferrer" className={styles.wikiLink}>
            {linkText}
          </a>
        );
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  };

  // Split lines into blocks (Headings, Code Blocks, Callouts, Tables, Lists, Paragraphs)
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let codeBlockCount = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 1. Code Block ```lang
    if (line.trim().startsWith("```")) {
      const lang = line.trim().replace(/^```/, "") || "bash";
      let codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      const fullCode = codeLines.join("\n");
      const blockIdx = codeBlockCount++;

      blocks.push(
        <div key={`code-${blockIdx}`} className={styles.codeBlockWrapper}>
          <div className={styles.codeHeader}>
            <span className={styles.codeLang}>{lang}</span>
            <button
              onClick={() => handleCopyCode(fullCode, blockIdx)}
              className={styles.copyCodeBtn}
            >
              {copiedCodeIndex === blockIdx ? <FiCheck color="#30d158" size={13} /> : <FiCopy size={13} />}
              <span>{copiedCodeIndex === blockIdx ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <pre className={styles.preCode}>
            <code>{fullCode}</code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // 2. GitHub Callout Alerts (> [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT])
    if (line.trim().startsWith("> [!")) {
      const typeMatch = line.trim().match(/^>\s*\[!(NOTE|TIP|WARNING|IMPORTANT)\]/i);
      const alertType = typeMatch ? typeMatch[1].toUpperCase() : "NOTE";
      let alertLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        alertLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }

      let alertIcon = <FiInfo size={16} />;
      let alertClass = styles.alertNote;
      if (alertType === "TIP") {
        alertIcon = <FiHelpCircle size={16} />;
        alertClass = styles.alertTip;
      } else if (alertType === "WARNING") {
        alertIcon = <FiAlertTriangle size={16} />;
        alertClass = styles.alertWarning;
      } else if (alertType === "IMPORTANT") {
        alertIcon = <FiAlertCircle size={16} />;
        alertClass = styles.alertImportant;
      }

      blocks.push(
        <div key={`alert-${i}`} className={`${styles.alertBlock} ${alertClass}`}>
          <div className={styles.alertHeader}>
            {alertIcon}
            <span className={styles.alertTitle}>{alertType}</span>
          </div>
          <div className={styles.alertContent}>
            {alertLines.map((al, idx) => (
              <p key={idx}>{renderInline(al)}</p>
            ))}
          </div>
        </div>
      );
      continue;
    }

    // 3. Headings (# H1, ## H2, ### H3)
    if (line.startsWith("# ")) {
      const title = line.replace(/^#\s+/, "");
      const slugId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      blocks.push(<h1 key={`h1-${i}`} id={slugId} className={styles.heading1}>{renderInline(title)}</h1>);
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      const title = line.replace(/^##\s+/, "");
      const slugId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      blocks.push(<h2 key={`h2-${i}`} id={slugId} className={styles.heading2}>{renderInline(title)}</h2>);
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      const title = line.replace(/^###\s+/, "");
      const slugId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      blocks.push(<h3 key={`h3-${i}`} id={slugId} className={styles.heading3}>{renderInline(title)}</h3>);
      i++;
      continue;
    }

    // 4. Markdown Tables (| Col1 | Col2 |)
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableRows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const rowStr = lines[i].trim();
        // Skip separator row (|---|---|)
        if (!rowStr.includes("---")) {
          const cells = rowStr.split("|").slice(1, -1).map((c) => c.trim());
          tableRows.push(cells);
        }
        i++;
      }

      if (tableRows.length > 0) {
        const headerCells = tableRows[0];
        const bodyRows = tableRows.slice(1);
        blocks.push(
          <div key={`table-${i}`} className={styles.tableWrapper}>
            <table className={styles.markdownTable}>
              <thead>
                <tr>
                  {headerCells.map((cell, idx) => (
                    <th key={idx}>{renderInline(cell)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx}>{renderInline(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // 5. Lists (- Item or * Item)
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))) {
        listItems.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={`ul-${i}`} className={styles.markdownUl}>
          {listItems.map((li, idx) => (
            <li key={idx}>{renderInline(li)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // 6. Horizontal Divider (---)
    if (line.trim() === "---") {
      blocks.push(<hr key={`hr-${i}`} className={styles.markdownHr} />);
      i++;
      continue;
    }

    // 7. Regular Paragraph
    if (line.trim() !== "") {
      blocks.push(
        <p key={`p-${i}`} className={styles.markdownP}>
          {renderInline(line)}
        </p>
      );
    }

    i++;
  }

  return <div className={styles.markdownBody}>{blocks}</div>;
}
