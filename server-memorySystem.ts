/**
 * Long-Term Memory System - Stores and retrieves agent lessons, preferences, and solutions
 * Implements vector storage for semantic search and similarity matching
 */

interface MemoryEntry {
  id: string;
  userId: number;
  projectId?: number;
  memoryType: "lesson" | "preference" | "solution" | "error";
  key: string;
  value: string;
  embedding?: number[];
  relevanceScore?: number;
  createdAt: Date;
  updatedAt: Date;
  accessCount: number;
  lastAccessed: Date;
}

interface MemoryQuery {
  userId: number;
  projectId?: number;
  memoryType?: "lesson" | "preference" | "solution" | "error";
  query?: string;
  limit?: number;
}

interface MemoryRetrievalResult {
  entries: MemoryEntry[];
  totalResults: number;
  executionTime: number;
}

/**
 * Vector Embedding Service - Generates embeddings for semantic search
 */
export class VectorEmbeddingService {
  /**
   * Generate embedding for text
   * In real implementation: use OpenAI embeddings or similar
   */
  async generateEmbedding(text: string): Promise<number[]> {
    // Mock embedding - in production use actual embedding service
    const hash = this.simpleHash(text);
    const embedding: number[] = [];

    for (let i = 0; i < 384; i++) {
      embedding.push(Math.sin(hash + i) * 0.5 + 0.5);
    }

    return embedding;
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) return 0;

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      magnitude1 += embedding1[i] * embedding1[i];
      magnitude2 += embedding2[i] * embedding2[i];
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) return 0;

    return dotProduct / (magnitude1 * magnitude2);
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash;
  }
}

/**
 * Memory Storage - Persists and retrieves memory entries
 */
export class MemoryStorage {
  private memories: Map<string, MemoryEntry> = new Map();
  private embeddingService = new VectorEmbeddingService();
  private nextId = 1;

  /**
   * Store a new memory entry
   */
  async store(
    userId: number,
    memoryType: "lesson" | "preference" | "solution" | "error",
    key: string,
    value: string,
    projectId?: number
  ): Promise<MemoryEntry> {
    const id = `mem-${this.nextId++}`;
    const embedding = await this.embeddingService.generateEmbedding(value);

    const entry: MemoryEntry = {
      id,
      userId,
      projectId,
      memoryType,
      key,
      value,
      embedding,
      createdAt: new Date(),
      updatedAt: new Date(),
      accessCount: 0,
      lastAccessed: new Date(),
    };

    this.memories.set(id, entry);
    return entry;
  }

  /**
   * Retrieve memories with semantic search
   */
  async retrieve(query: MemoryQuery): Promise<MemoryRetrievalResult> {
    const startTime = Date.now();
    const results: MemoryEntry[] = [];

    // Filter by user and project
    for (const [, entry] of this.memories) {
      if (entry.userId !== query.userId) continue;
      if (query.projectId && entry.projectId !== query.projectId) continue;
      if (query.memoryType && entry.memoryType !== query.memoryType) continue;

      // If query text provided, calculate similarity
      if (query.query && entry.embedding) {
        const queryEmbedding = await this.embeddingService.generateEmbedding(query.query);
        const similarity = this.embeddingService.calculateSimilarity(
          entry.embedding,
          queryEmbedding
        );

        if (similarity > 0.3) {
          entry.relevanceScore = similarity;
          results.push(entry);
        }
      } else {
        results.push(entry);
      }
    }

    // Sort by relevance score or access count
    results.sort((a, b) => {
      const scoreA = a.relevanceScore || 0;
      const scoreB = b.relevanceScore || 0;
      return scoreB - scoreA || b.accessCount - a.accessCount;
    });

    // Limit results
    const limit = query.limit || 10;
    const limited = results.slice(0, limit);

    // Update access count
    for (const entry of limited) {
      entry.accessCount++;
      entry.lastAccessed = new Date();
    }

    const executionTime = Date.now() - startTime;

    return {
      entries: limited,
      totalResults: results.length,
      executionTime,
    };
  }

  /**
   * Update an existing memory entry
   */
  async update(id: string, userId: number, updates: Partial<MemoryEntry>): Promise<MemoryEntry> {
    const entry = this.memories.get(id);
    if (!entry || entry.userId !== userId) {
      throw new Error("Memory not found or unauthorized");
    }

    const updated = {
      ...entry,
      ...updates,
      updatedAt: new Date(),
    };

    // Regenerate embedding if value changed
    if (updates.value) {
      updated.embedding = await this.embeddingService.generateEmbedding(updates.value);
    }

    this.memories.set(id, updated);
    return updated;
  }

  /**
   * Delete a memory entry
   */
  async delete(id: string, userId: number): Promise<boolean> {
    const entry = this.memories.get(id);
    if (!entry || entry.userId !== userId) {
      throw new Error("Memory not found or unauthorized");
    }

    return this.memories.delete(id);
  }

  /**
   * Get memory statistics
   */
  getStatistics(userId: number): {
    totalMemories: number;
    byType: Record<string, number>;
    mostAccessed: MemoryEntry[];
    recentlyAdded: MemoryEntry[];
  } {
    const userMemories = Array.from(this.memories.values()).filter((m) => m.userId === userId);

    const byType: Record<string, number> = {
      lesson: 0,
      preference: 0,
      solution: 0,
      error: 0,
    };

    for (const memory of userMemories) {
      byType[memory.memoryType]++;
    }

    const mostAccessed = userMemories
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 5);

    const recentlyAdded = userMemories
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    return {
      totalMemories: userMemories.length,
      byType,
      mostAccessed,
      recentlyAdded,
    };
  }
}

/**
 * Memory Context - Provides context-aware memory retrieval
 */
export class MemoryContext {
  private storage: MemoryStorage;

  constructor(storage: MemoryStorage) {
    this.storage = storage;
  }

  /**
   * Get relevant memories for a task
   */
  async getContextForTask(
    userId: number,
    projectId: number,
    taskDescription: string
  ): Promise<MemoryEntry[]> {
    const result = await this.storage.retrieve({
      userId,
      projectId,
      query: taskDescription,
      limit: 5,
    });

    return result.entries;
  }

  /**
   * Learn from execution result
   */
  async learnFromExecution(
    userId: number,
    projectId: number,
    taskDescription: string,
    result: string,
    success: boolean
  ): Promise<void> {
    const memoryType = success ? "solution" : "error";
    const key = `${taskDescription}-${Date.now()}`;

    await this.storage.store(userId, memoryType, key, result, projectId);
  }

  /**
   * Get memory statistics for dashboard
   */
  getMemoryStats(userId: number) {
    return this.storage.getStatistics(userId);
  }
}

export { MemoryStorage, VectorEmbeddingService, MemoryContext };
