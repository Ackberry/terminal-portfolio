import type { Command } from '../types';

// Import filesystem commands
import { lsCommand, cdCommand, catCommand, pwdCommand } from './filesystem';

// Import utility commands
import { clearCommand, historyCommand, echoCommand, dateCommand, uptimeCommand } from './utils';

// Import info commands
import { whoamiCommand, neofetchCommand, helpCommand, openCommand } from './info';

// Import easter egg commands
import {
  sudoCommand,
  rmCommand,
  vimCommand,
  exitCommand,
  exitForceCommand,
  hackCommand,
  matrixCommand,
  cowsayCommand,
} from './easter-eggs';

// Command registry
export const commandRegistry = new Map<string, Command>();

// Register all commands
const commands: Command[] = [
  // Filesystem
  lsCommand,
  cdCommand,
  catCommand,
  pwdCommand,
  
  // Utilities
  clearCommand,
  historyCommand,
  echoCommand,
  dateCommand,
  uptimeCommand,
  
  // Info
  whoamiCommand,
  neofetchCommand,
  helpCommand,
  openCommand,
  
  // Easter eggs
  sudoCommand,
  rmCommand,
  vimCommand,
  exitCommand,
  exitForceCommand,
  hackCommand,
  matrixCommand,
  cowsayCommand,
];

for (const cmd of commands) {
  commandRegistry.set(cmd.name, cmd);
}

// Aliases
commandRegistry.set('dir', lsCommand);
commandRegistry.set('type', catCommand);
commandRegistry.set('cls', clearCommand);
commandRegistry.set('nano', vimCommand);
commandRegistry.set('emacs', vimCommand);
commandRegistry.set('quit', exitCommand);
commandRegistry.set('q', exitCommand);
