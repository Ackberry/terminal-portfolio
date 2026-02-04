import type { Command, CommandContext, CommandResult } from '../types';

export const clearCommand: Command = {
  name: 'clear',
  description: 'Clear the terminal screen',
  usage: 'clear',
  execute: (): CommandResult => {
    return { output: '', clear: true };
  },
};

export const historyCommand: Command = {
  name: 'history',
  description: 'Show command history',
  usage: 'history',
  execute: (ctx: CommandContext): CommandResult => {
    const history = ctx.terminal.getHistory();
    if (history.length === 0) {
      return { output: '<span class="color-gray">No commands in history</span>', html: true };
    }

    const lines = history.map((cmd, i) => {
      const num = (i + 1).toString().padStart(4);
      return `<span class="color-gray">${num}</span>  ${cmd}`;
    });

    return { output: lines.join('\n'), html: true };
  },
};

export const echoCommand: Command = {
  name: 'echo',
  description: 'Display a line of text',
  usage: 'echo [text...]',
  execute: (ctx: CommandContext): CommandResult => {
    return { output: ctx.args.join(' ') };
  },
};

export const dateCommand: Command = {
  name: 'date',
  description: 'Display current date and time',
  usage: 'date',
  execute: (): CommandResult => {
    const now = new Date();
    const formatted = now.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    return { output: formatted };
  },
};

export const uptimeCommand: Command = {
  name: 'uptime',
  description: 'Show how long the terminal has been running',
  usage: 'uptime',
  execute: (): CommandResult => {
    const startTime = (window as unknown as { terminalStartTime?: number }).terminalStartTime;
    if (!startTime) {
      (window as unknown as { terminalStartTime: number }).terminalStartTime = Date.now();
      return { output: 'up 0 minutes' };
    }

    const elapsed = Date.now() - startTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    let timeStr = '';
    if (hours > 0) {
      timeStr = `${hours} hour${hours > 1 ? 's' : ''}, ${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      timeStr = `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      timeStr = `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }

    return { output: `up ${timeStr}` };
  },
};
