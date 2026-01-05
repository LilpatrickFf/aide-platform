/**
 * AIDE Dashboard - Main three-panel UI component
 * Combines file explorer, code editor, and terminal/preview
 */

import React, { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileExplorer } from "./FileExplorer";
import { CodeEditor } from "./CodeEditor";
import { Terminal } from "./Terminal";
import { LivePreview } from "./LivePreview";
import { Plus, Trash2, Play, Save } from "lucide-react";

interface Project {
  id: number;
  name: string;
  description?: string;
  status: "active" | "completed" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectFile {
  id: number;
  projectId: number;
  path: string;
  content?: string;
  fileType?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AIDEDashboardProps {
  project: Project;
  onProjectUpdate?: (project: Project) => void;
}

export function AIDEDashboard({ project, onProjectUpdate }: AIDEDashboardProps) {
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [editorContent, setEditorContent] = useState<string>("");
  const [terminalOutput, setTerminalOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [showNewFileInput, setShowNewFileInput] = useState(false);

  const handleFileSelect = (file: ProjectFile) => {
    setSelectedFile(file);
    setEditorContent(file.content || "");
  };

  const handleFileCreate = () => {
    if (!newFileName.trim()) return;

    const newFile: ProjectFile = {
      id: Math.random(),
      projectId: project.id,
      path: newFileName,
      content: "",
      fileType: getFileType(newFileName),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setFiles([...files, newFile]);
    setNewFileName("");
    setShowNewFileInput(false);
    handleFileSelect(newFile);
  };

  const handleFileSave = () => {
    if (!selectedFile) return;

    const updatedFile = { ...selectedFile, content: editorContent };
    setFiles(files.map((f) => (f.id === selectedFile.id ? updatedFile : f)));
    setSelectedFile(updatedFile);

    // In real implementation: call API to save file
    console.log("File saved:", updatedFile);
  };

  const handleFileDelete = (fileId: number) => {
    setFiles(files.filter((f) => f.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
      setEditorContent("");
    }
  };

  const handleRunProject = async () => {
    setIsRunning(true);
    setTerminalOutput("Building project...\n");

    // Simulate build process
    setTimeout(() => {
      setTerminalOutput((prev) => prev + "Build completed successfully!\n");
      setIsRunning(false);
    }, 2000);
  };

  const getFileType = (fileName: string): string => {
    const ext = fileName.split(".").pop() || "";
    const typeMap: Record<string, string> = {
      ts: "typescript",
      tsx: "typescript",
      js: "javascript",
      jsx: "javascript",
      py: "python",
      json: "json",
      html: "html",
      css: "css",
      md: "markdown",
    };
    return typeMap[ext] || "text";
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            {project.description && (
              <p className="text-sm text-muted-foreground">{project.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRunProject}
              disabled={isRunning}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              {isRunning ? "Running..." : "Run"}
            </Button>
            <Button
              onClick={handleFileSave}
              disabled={!selectedFile}
              variant="outline"
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Three Panel Layout */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - File Explorer */}
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="h-full flex flex-col border-r">
            <div className="border-b p-3 flex items-center justify-between">
              <h2 className="font-semibold text-sm">Files</h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowNewFileInput(!showNewFileInput)}
                className="h-6 w-6 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {showNewFileInput && (
              <div className="p-2 border-b flex gap-1">
                <Input
                  placeholder="filename.ts"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleFileCreate();
                    if (e.key === "Escape") {
                      setShowNewFileInput(false);
                      setNewFileName("");
                    }
                  }}
                  autoFocus
                  className="h-8 text-xs"
                />
              </div>
            )}

            <FileExplorer
              files={files}
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              onFileDelete={handleFileDelete}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Middle Panel - Code Editor */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col">
            {selectedFile ? (
              <>
                <div className="border-b p-3 bg-card">
                  <p className="text-sm font-mono">{selectedFile.path}</p>
                </div>
                <CodeEditor
                  content={editorContent}
                  onChange={setEditorContent}
                  language={selectedFile.fileType || "typescript"}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Select a file to edit</p>
              </div>
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Right Panel - Terminal and Preview */}
        <ResizablePanel defaultSize={30} minSize={20}>
          <Tabs defaultValue="terminal" className="h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="terminal">Terminal</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="terminal" className="flex-1 overflow-hidden">
              <Terminal output={terminalOutput} onCommand={(cmd) => {
                setTerminalOutput((prev) => prev + `$ ${cmd}\n`);
              }} />
            </TabsContent>

            <TabsContent value="preview" className="flex-1 overflow-hidden">
              <LivePreview projectId={project.id} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default AIDEDashboard;
