// File system types
export interface FSNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: Map<string, FSNode>;
}

// Command types
export interface CommandContext {
  args: string[];
  flags: Set<string>;
  terminal: TerminalInterface;
  fs: FileSystemInterface;
}

export interface CommandResult {
  output: string;
  isError?: boolean;
  clear?: boolean;
  html?: boolean;
}

export type CommandFunction = (ctx: CommandContext) => CommandResult | Promise<CommandResult>;

export interface Command {
  name: string;
  description: string;
  usage?: string;
  execute: CommandFunction;
}

// Terminal interface for commands to use
export interface TerminalInterface {
  getHistory(): string[];
  print(text: string, isError?: boolean, isHtml?: boolean): void;
  clear(): void;
}

// FileSystem interface
export interface FileSystemInterface {
  getCurrentPath(): string;
  setCurrentPath(path: string): boolean;
  resolvePath(path: string): string;
  getNode(path: string): FSNode | null;
  listDirectory(path: string): FSNode[] | null;
  readFile(path: string): string | null;
  isDirectory(path: string): boolean;
  isFile(path: string): boolean;
  getCompletions(partial: string): string[];
}
