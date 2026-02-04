import type { Command, CommandContext, CommandResult } from '../types';

// Command descriptions for help - defined here to avoid circular imports
const commandDescriptions: Record<string, { description: string; usage: string }> = {
  ls: { description: 'List directory contents', usage: 'ls [-la] [path]' },
  cd: { description: 'Change directory', usage: 'cd [path]' },
  cat: { description: 'Display file contents', usage: 'cat <file>' },
  pwd: { description: 'Print working directory', usage: 'pwd' },
  clear: { description: 'Clear the terminal screen', usage: 'clear' },
  history: { description: 'Show command history', usage: 'history' },
  echo: { description: 'Display a line of text', usage: 'echo [text...]' },
  date: { description: 'Display current date and time', usage: 'date' },
  uptime: { description: 'Show how long the terminal has been running', usage: 'uptime' },
  whoami: { description: 'Display current user information', usage: 'whoami' },
  neofetch: { description: 'Display system information with ASCII art', usage: 'neofetch' },
  help: { description: 'Display available commands', usage: 'help [command]' },
  open: { description: 'Open a link (github, linkedin, email)', usage: 'open <github|linkedin|email>' },
  sudo: { description: 'Execute command as superuser', usage: 'sudo <command>' },
  rm: { description: 'Remove files (just kidding)', usage: 'rm [-rf] <file>' },
  vim: { description: 'Open the vim editor', usage: 'vim [file]' },
  exit: { description: 'Exit the terminal', usage: 'exit' },
  hack: { description: 'Initiate hacking sequence', usage: 'hack [target]' },
  matrix: { description: 'Display matrix rain effect', usage: 'matrix' },
  cowsay: { description: 'Have a cow say something', usage: 'cowsay <message>' },
};

export const whoamiCommand: Command = {
  name: 'whoami',
  description: 'Display current user information',
  usage: 'whoami',
  execute: (): CommandResult => {
    const output = `
<span class="color-green bold">Deep Akbari</span>
<span class="color-gray">Software Engineer | CS Student @ USF</span>

<span class="color-cyan">Currently:</span> Building cool things with AI & web technologies
<span class="color-cyan">Location:</span>  Tampa, FL
<span class="color-cyan">Focus:</span>    Full-stack Development, Machine Learning, DevOps

<span class="color-gray">Type 'cat about.txt' for more details</span>
`;
    return { output: output.trim(), html: true };
  },
};

export const neofetchCommand: Command = {
  name: 'neofetch',
  description: 'Display system information with ASCII art',
  usage: 'neofetch',
  execute: (): CommandResult => {
    const ascii = `
<span class="ascii-art color-green">       ██████╗ ███████╗███████╗██████╗ </span>
<span class="ascii-art color-green">       ██╔══██╗██╔════╝██╔════╝██╔══██╗</span>
<span class="ascii-art color-green">       ██║  ██║█████╗  █████╗  ██████╔╝</span>
<span class="ascii-art color-green">       ██║  ██║██╔══╝  ██╔══╝  ██╔═══╝ </span>
<span class="ascii-art color-green">       ██████╔╝███████╗███████╗██║     </span>
<span class="ascii-art color-green">       ╚═════╝ ╚══════╝╚══════╝╚═╝     </span>
`;

    const info = `
<span class="color-green bold">deep</span><span class="color-white">@</span><span class="color-green bold">portfolio</span>
<span class="color-gray">───────────────────────</span>
<span class="neofetch-label">OS:</span>        <span class="neofetch-value">Portfolio v1.0</span>
<span class="neofetch-label">Host:</span>      <span class="neofetch-value">deep@portfolio</span>
<span class="neofetch-label">Kernel:</span>    <span class="neofetch-value">TypeScript 5.x</span>
<span class="neofetch-label">Shell:</span>     <span class="neofetch-value">deep-term 1.0</span>
<span class="neofetch-label">Terminal:</span>  <span class="neofetch-value">Termux-style</span>
<span class="color-gray">───────────────────────</span>
<span class="neofetch-label">Education:</span> <span class="neofetch-value">USF CS '28</span>
<span class="neofetch-label">Location:</span>  <span class="neofetch-value">Tampa, FL</span>
<span class="neofetch-label">Status:</span>    <span class="color-green">● Available</span>
<span class="color-gray">───────────────────────</span>
<span class="neofetch-label">Email:</span>     <a href="mailto:ackberrie@gmail.com">ackberrie@gmail.com</a>
<span class="neofetch-label">GitHub:</span>    <a href="https://github.com/ackberry" target="_blank">github.com/ackberry</a>
<span class="neofetch-label">LinkedIn:</span>  <a href="https://linkedin.com/in/deep-akbari/" target="_blank">linkedin.com/in/deep-akbari</a>
`;

    // Combine ASCII art and info side by side
    const asciiLines = ascii.trim().split('\n');
    const infoLines = info.trim().split('\n');
    const maxLines = Math.max(asciiLines.length, infoLines.length);

    const combined: string[] = [];
    for (let i = 0; i < maxLines; i++) {
      const asciiLine = asciiLines[i] || '';
      const infoLine = infoLines[i] || '';
      // ASCII art is about 40 chars wide visually
      combined.push(`${asciiLine}    ${infoLine}`);
    }

    return { output: combined.join('\n'), html: true };
  },
};

export const helpCommand: Command = {
  name: 'help',
  description: 'Display available commands',
  usage: 'help [command]',
  execute: async (ctx: CommandContext): Promise<CommandResult> => {
    if (ctx.args.length > 0) {
      // Show help for specific command
      const cmdName = ctx.args[0].toLowerCase();
      const cmd = commandDescriptions[cmdName];
      if (!cmd) {
        return {
          output: `help: no help entry for '${cmdName}'`,
          isError: true,
        };
      }
      return {
        output: `
<span class="color-green bold">${cmdName}</span>
<span class="color-gray">Description:</span> ${cmd.description}
<span class="color-gray">Usage:</span>       ${cmd.usage}
`.trim(),
        html: true,
      };
    }

    // Show all commands with loading animation
    const categories = {
      'Navigation': ['ls', 'cd', 'pwd', 'cat'],
      'Information': ['help', 'whoami', 'neofetch', 'open'],
      'Utilities': ['clear', 'history', 'echo', 'date', 'uptime'],
      'Fun': ['sudo', 'rm', 'vim', 'exit', 'hack', 'matrix', 'cowsay'],
    };

    // Small delay for loading effect
    await new Promise(resolve => setTimeout(resolve, 100));

    // Build and display each category with slight delays
    for (const [category, commands] of Object.entries(categories)) {
      let categoryOutput = `<span class="color-orange bold">${category}</span>\n`;
      for (const cmdName of commands) {
        const cmd = commandDescriptions[cmdName];
        if (cmd) {
          const paddedName = cmdName.padEnd(12);
          categoryOutput += `  <span class="color-green">${paddedName}</span> <span class="color-gray">${cmd.description}</span>\n`;
        }
      }
      ctx.terminal.print(categoryOutput, false, true);
      await new Promise(resolve => setTimeout(resolve, 80));
    }

    // Final help text
    await new Promise(resolve => setTimeout(resolve, 50));
    const footer = `<span class="color-gray">Type 'help <command>' for more information about a specific command.</span>\n<span class="color-gray">Use Tab for auto-completion. Use ↑/↓ to navigate history.</span>`;
    
    return { output: footer, html: true };
  },
};

export const openCommand: Command = {
  name: 'open',
  description: 'Open a link (github, linkedin, email)',
  usage: 'open <github|linkedin|email>',
  execute: (ctx): CommandResult => {
    const target = ctx.args[0]?.toLowerCase();

    const links: Record<string, { url: string; label: string }> = {
      github: { url: 'https://github.com/ackberry', label: 'GitHub' },
      gh: { url: 'https://github.com/ackberry', label: 'GitHub' },
      linkedin: { url: 'https://linkedin.com/in/deep-akbari/', label: 'LinkedIn' },
      li: { url: 'https://linkedin.com/in/deep-akbari/', label: 'LinkedIn' },
      email: { url: 'mailto:ackberrie@gmail.com', label: 'Email' },
      mail: { url: 'mailto:ackberrie@gmail.com', label: 'Email' },
    };

    if (!target) {
      return {
        output: `
<span class="color-orange bold">Usage:</span> open <target>

<span class="color-orange bold">Available targets:</span>
  <span class="color-green">github</span>   <span class="color-gray">Open GitHub profile</span>
  <span class="color-green">linkedin</span> <span class="color-gray">Open LinkedIn profile</span>
  <span class="color-green">email</span>    <span class="color-gray">Send an email</span>
`.trim(),
        html: true,
      };
    }

    const link = links[target];
    if (!link) {
      return {
        output: `open: unknown target '${target}'. Try: github, linkedin, email`,
        isError: true,
      };
    }

    // Open the link
    window.open(link.url, '_blank');
    return {
      output: `<span class="color-green">Opening ${link.label}...</span>`,
      html: true,
    };
  },
};
