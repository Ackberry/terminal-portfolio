import type { Command, CommandContext, CommandResult } from '../types';

export const lsCommand: Command = {
  name: 'ls',
  description: 'List directory contents',
  usage: 'ls [-la] [path]',
  execute: (ctx: CommandContext): CommandResult => {
    const path = ctx.args[0] || ctx.fs.getCurrentPath();
    const entries = ctx.fs.listDirectory(path);

    if (!entries) {
      return {
        output: `ls: cannot access '${path}': No such file or directory`,
        isError: true,
      };
    }

    if (entries.length === 0) {
      return { output: '' };
    }

    const showDetails = ctx.flags.has('l') || ctx.flags.has('a');

    if (showDetails) {
      // Detailed listing
      const lines: string[] = [];
      for (const entry of entries) {
        const typeChar = entry.type === 'directory' ? 'd' : '-';
        const perms = entry.type === 'directory' ? 'rwxr-xr-x' : 'rw-r--r--';
        const size = entry.type === 'directory' ? '4096' : (entry.content?.length || 0).toString();
        const colorClass = entry.type === 'directory' ? 'ls-directory' : 'ls-file';
        const suffix = entry.type === 'directory' ? '/' : '';
        lines.push(
          `<span class="color-gray">${typeChar}${perms}  1 deep deep ${size.padStart(6)}</span>  <span class="${colorClass}">${entry.name}${suffix}</span>`
        );
      }
      return { output: lines.join('\n'), html: true };
    } else {
      // Simple listing
      const items = entries.map(entry => {
        const colorClass = entry.type === 'directory' ? 'ls-directory' : 'ls-file';
        const suffix = entry.type === 'directory' ? '/' : '';
        return `<span class="${colorClass}">${entry.name}${suffix}</span>`;
      });
      return { output: items.join('  '), html: true };
    }
  },
};

export const cdCommand: Command = {
  name: 'cd',
  description: 'Change directory',
  usage: 'cd [path]',
  execute: (ctx: CommandContext): CommandResult => {
    const path = ctx.args[0] || '~';

    if (ctx.fs.setCurrentPath(path)) {
      return { output: '' };
    } else {
      const resolvedPath = ctx.fs.resolvePath(path);
      if (ctx.fs.isFile(resolvedPath)) {
        return {
          output: `cd: not a directory: ${path}`,
          isError: true,
        };
      }
      return {
        output: `cd: no such file or directory: ${path}`,
        isError: true,
      };
    }
  },
};

export const catCommand: Command = {
  name: 'cat',
  description: 'Display file contents',
  usage: 'cat <file>',
  execute: (ctx: CommandContext): CommandResult => {
    if (ctx.args.length === 0) {
      return {
        output: 'cat: missing file operand',
        isError: true,
      };
    }

    const path = ctx.args[0];
    const content = ctx.fs.readFile(path);

    if (content === null) {
      if (ctx.fs.isDirectory(path)) {
        return {
          output: `cat: ${path}: Is a directory`,
          isError: true,
        };
      }
      return {
        output: `cat: ${path}: No such file or directory`,
        isError: true,
      };
    }

    return { output: content.trim(), html: true };
  },
};

export const pwdCommand: Command = {
  name: 'pwd',
  description: 'Print working directory',
  usage: 'pwd',
  execute: (ctx: CommandContext): CommandResult => {
    return { output: ctx.fs.getCurrentPath() };
  },
};
