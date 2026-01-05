/**
 * AIDE Service - Comprehensive backend service for project and agent management
 * Handles all CRUD operations with proper authorization
 */

import { eq, and, isNull } from "drizzle-orm";

// Mock database interface - in real implementation, use drizzle ORM
interface Database {
  insert: (table: any) => any;
  select: () => any;
  update: (table: any) => any;
  delete: (table: any) => any;
}

// Types from schema
interface Project {
  id: number;
  userId: number;
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

interface BuildHistory {
  id: number;
  projectId: number;
  buildNumber: number;
  status: "pending" | "running" | "success" | "failed";
  output?: string;
  error?: string;
  deploymentUrl?: string;
  createdAt: Date;
  completedAt?: Date;
}

interface AgentMemory {
  id: number;
  userId: number;
  projectId?: number;
  memoryType: "lesson" | "preference" | "solution" | "error";
  key: string;
  value: string;
  embedding?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AgentTask {
  id: number;
  projectId: number;
  agentType: "planner" | "coder" | "verifier" | "executor";
  status: "pending" | "running" | "completed" | "failed";
  prompt: string;
  result?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

/**
 * Project Management Operations
 */

export async function createProject(
  db: Database,
  userId: number,
  name: string,
  description?: string
): Promise<Project> {
  const result = await db.insert("projects").values({
    userId,
    name,
    description,
    status: "active",
  });
  return result;
}

export async function getProjectsByUser(db: Database, userId: number): Promise<Project[]> {
  return db.select().from("projects").where(eq("userId", userId));
}

export async function getProject(
  db: Database,
  projectId: number,
  userId: number
): Promise<Project | null> {
  const result = await db
    .select()
    .from("projects")
    .where(and(eq("id", projectId), eq("userId", userId)))
    .limit(1);

  return result[0] || null;
}

export async function updateProject(
  db: Database,
  projectId: number,
  userId: number,
  updates: Partial<Omit<Project, "userId" | "id">>
): Promise<void> {
  const project = await getProject(db, projectId, userId);
  if (!project) throw new Error("Project not found or unauthorized");

  await db.update("projects").set(updates).where(eq("id", projectId));
}

export async function deleteProject(
  db: Database,
  projectId: number,
  userId: number
): Promise<void> {
  const project = await getProject(db, projectId, userId);
  if (!project) throw new Error("Project not found or unauthorized");

  // Delete related records
  await db.delete("projectFiles").where(eq("projectId", projectId));
  await db.delete("buildHistory").where(eq("projectId", projectId));
  await db.delete("agentMemory").where(eq("projectId", projectId));
  await db.delete("agentTasks").where(eq("projectId", projectId));
  await db.delete("projects").where(eq("id", projectId));
}

/**
 * File Management Operations
 */

export async function createOrUpdateFile(
  db: Database,
  projectId: number,
  userId: number,
  path: string,
  content: string,
  fileType?: string
): Promise<void> {
  const project = await getProject(db, projectId, userId);
  if (!project) throw new Error("Project not found or unauthorized");

  const existing = await db
    .select()
    .from("projectFiles")
    .where(and(eq("projectId", projectId), eq("path", path)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update("projectFiles")
      .set({ content, fileType, updatedAt: new Date() })
      .where(eq("id", existing[0].id));
  } else {
    await db.insert("projectFiles").values({
      projectId,
      path,
      content,
      fileType,
    });
  }
}

export async function getFile(
  db: Database,
  projectId: number,
  userId: number,
  path: string
): Promise<ProjectFile | null> {
  const project = await getProject(db, projectId, userId);
  if (!project) return null;

  const result = await db
    .select()
    .from("projectFiles")
    .where(and(eq("projectId", projectId), eq("path", path)))
    .limit(1);

  return result[0] || null;
}

export async function getProjectFiles(
  db: Database,
  projectId: number,
  userId: number
): Promise<ProjectFile[]> {
  const project = await getProject(db, projectId, userId);
  if (!project) return [];

  return db.select().from("projectFiles").where(eq("projectId", projectId));
}

export async function deleteFile(
  db: Database,
  projectId: number,
  userId: number,
  path: string
): Promise<void> {
  const project = await getProject(db, projectId, userId);
  if (!project) throw new Error("Project not found or unauthorized");

  await db
    .delete("projectFiles")
    .where(and(eq("projectId", projectId), eq("path", path)));
}

/**
 * Build History Operations
 */

export async function createBuildRecord(
  db: Database,
  projectId: number,
  userId: number,
  buildNumber: number
): Promise<BuildHistory> {
  const project = await getProject(db, projectId, userId);
  if (!project) throw new Error("Project not found or unauthorized");

  const result = await db.insert("buildHistory").values({
    projectId,
    buildNumber,
    status: "pending",
  });

  return result;
}

export async function updateBuildRecord(
  db: Database,
  buildId: number,
  projectId: number,
  userId: number,
  updates: Partial<Omit<BuildHistory, "projectId" | "buildNumber" | "id">>
): Promise<void> {
  const project = await getProject(db, projectId, userId);
  if (!project) throw new Error("Project not found or unauthorized");

  await db
    .update("buildHistory")
    .set({ ...updates, updatedAt: new Date() })
    .where(eq("id", buildId));
}

export async function getBuildHistory(
  db: Database,
  projectId: number,
  userId: number
): Promise<BuildHistory[]> {
  const project = await getProject(db, projectId, userId);
  if (!project) return [];

  return db
    .select()
    .from("buildHistory")
    .where(eq("projectId", projectId));
}

/**
 * Agent Memory Operations
 */

export async function storeMemory(
  db: Database,
  userId: number,
  memoryType: "lesson" | "preference" | "solution" | "error",
  key: string,
  value: string,
  projectId?: number,
  embedding?: string
): Promise<AgentMemory> {
  const result = await db.insert("agentMemory").values({
    userId,
    projectId,
    memoryType,
    key,
    value,
    embedding,
  });

  return result;
}

export async function retrieveMemory(
  db: Database,
  userId: number,
  memoryType?: "lesson" | "preference" | "solution" | "error",
  projectId?: number
): Promise<AgentMemory[]> {
  let conditions: any[] = [eq("userId", userId)];

  if (memoryType) {
    conditions.push(eq("memoryType", memoryType));
  }

  if (projectId !== undefined) {
    if (projectId === null) {
      conditions.push(isNull("projectId"));
    } else {
      conditions.push(eq("projectId", projectId));
    }
  }

  return db
    .select()
    .from("agentMemory")
    .where(and(...conditions));
}

export async function updateMemory(
  db: Database,
  memoryId: number,
  userId: number,
  updates: Partial<Omit<AgentMemory, "userId" | "id">>
): Promise<void> {
  const memory = await db
    .select()
    .from("agentMemory")
    .where(eq("id", memoryId))
    .limit(1);

  if (!memory[0] || memory[0].userId !== userId) {
    throw new Error("Memory not found or unauthorized");
  }

  await db
    .update("agentMemory")
    .set({ ...updates, updatedAt: new Date() })
    .where(eq("id", memoryId));
}

export async function deleteMemory(
  db: Database,
  memoryId: number,
  userId: number
): Promise<void> {
  const memory = await db
    .select()
    .from("agentMemory")
    .where(eq("id", memoryId))
    .limit(1);

  if (!memory[0] || memory[0].userId !== userId) {
    throw new Error("Memory not found or unauthorized");
  }

  await db.delete("agentMemory").where(eq("id", memoryId));
}

/**
 * Agent Task Operations
 */

export async function createAgentTask(
  db: Database,
  projectId: number,
  userId: number,
  agentType: "planner" | "coder" | "verifier" | "executor",
  prompt: string
): Promise<AgentTask> {
  const project = await getProject(db, projectId, userId);
  if (!project) throw new Error("Project not found or unauthorized");

  const result = await db.insert("agentTasks").values({
    projectId,
    agentType,
    prompt,
    status: "pending",
  });

  return result;
}

export async function updateAgentTask(
  db: Database,
  taskId: number,
  projectId: number,
  userId: number,
  updates: Partial<Omit<AgentTask, "projectId" | "id">>
): Promise<void> {
  const project = await getProject(db, projectId, userId);
  if (!project) throw new Error("Project not found or unauthorized");

  await db
    .update("agentTasks")
    .set(updates)
    .where(eq("id", taskId));
}

export async function getAgentTasks(
  db: Database,
  projectId: number,
  userId: number,
  status?: "pending" | "running" | "completed" | "failed"
): Promise<AgentTask[]> {
  const project = await getProject(db, projectId, userId);
  if (!project) return [];

  let query = db
    .select()
    .from("agentTasks")
    .where(eq("projectId", projectId));

  if (status) {
    query = query.where(eq("status", status));
  }

  return query;
}

export async function getAgentTask(
  db: Database,
  taskId: number,
  projectId: number,
  userId: number
): Promise<AgentTask | null> {
  const project = await getProject(db, projectId, userId);
  if (!project) return null;

  const result = await db
    .select()
    .from("agentTasks")
    .where(and(eq("id", taskId), eq("projectId", projectId)))
    .limit(1);

  return result[0] || null;
}
