/**
 * AIDE UI Components - File Explorer, Code Editor, Terminal, Live Preview
 */

import React, { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronDown, File, Folder, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * File Explorer Component
 */
interface FileExplorerProps {
  files: any[];
  selectedFile: any | null;
  onFileSelect: (file: any) => void;
  onFileDelete: (fileId: number) => void;
}

export function FileExplorer({
  files,
  selectedFile,
  onFileSelect,
  onFileDelete,
}: FileExplorerProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-1">
        {files.length === 0 ? (
          <div className="text-xs text-muted-foreground p-2">No files yet</div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-accent group ${
                selectedFile?.id === file.id ? "bg-accent" : ""
              }`}
              onClick={() => onFileSelect(file)}
            >
              <File className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-mono truncate flex-1">{file.path}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileDelete(file.id);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}

/**
 * Code Editor Component
 */
interface CodeEditorProps {
  content: string;
  onChange: (content: string) => void;
  language?: string;
}

export function CodeEditor({ content, onChange, language = "typescript" }: CodeEditorProps) {
  return (
    <div className="flex-1 flex flex-col bg-slate-950">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 p-4 bg-slate-950 text-slate-100 font-mono text-sm resize-none focus:outline-none"
        placeholder="// Start coding..."
        spellCheck="false"
      />
      <div className="border-t bg-slate-900 px-4 py-2 text-xs text-muted-foreground">
        Language: {language} | Lines: {content.split("\n").length}
      </div>
    </div>
  );
}

/**
 * Terminal Component
 */
interface TerminalProps {
  output: string;
  onCommand?: (command: string) => void;
}

export function Terminal({ output, onCommand }: TerminalProps) {
  const [command, setCommand] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  const handleCommand = () => {
    if (command.trim()) {
      onCommand?.(command);
      setCommand("");
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
      <ScrollArea className="flex-1">
        <div
          ref={scrollRef}
          className="p-4 font-mono text-sm text-slate-100 whitespace-pre-wrap break-words"
        >
          {output || "Ready for input..."}
        </div>
      </ScrollArea>

      <div className="border-t bg-slate-900 p-3 flex gap-2">
        <span className="text-slate-100 font-mono">$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCommand();
          }}
          placeholder="Enter command..."
          className="flex-1 bg-transparent text-slate-100 font-mono text-sm focus:outline-none"
        />
      </div>
    </div>
  );
}

/**
 * Live Preview Component
 */
interface LivePreviewProps {
  projectId: number;
  previewUrl?: string;
}

export function LivePreview({ projectId, previewUrl }: LivePreviewProps) {
  const [port, setPort] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In real implementation: fetch the preview port from backend
    // For now, use a default port based on project ID
    setPort(3000 + projectId);
    setLoading(false);
  }, [projectId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>Loading preview...</p>
      </div>
    );
  }

  if (!port && !previewUrl) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>No preview available. Build the project to see a preview.</p>
      </div>
    );
  }

  const iframeUrl = previewUrl || `http://localhost:${port}`;

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-card p-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{iframeUrl}</p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.open(iframeUrl, "_blank")}
        >
          Open in New Tab
        </Button>
      </div>
      <iframe
        src={iframeUrl}
        className="flex-1 border-0"
        title="Live Preview"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />
    </div>
  );
}

export default {
  FileExplorer,
  CodeEditor,
  Terminal,
  LivePreview,
};
