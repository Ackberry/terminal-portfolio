import type { Command, CommandResult } from '../types';

export const sudoCommand: Command = {
  name: 'sudo',
  description: 'Execute command as superuser',
  usage: 'sudo <command>',
  execute: (ctx): CommandResult => {
    const subCommand = ctx.args.join(' ');
    
    if (subCommand.includes('rm -rf') || subCommand.includes('rm -r')) {
      return {
        output: `
<span class="color-red bold">🛑 PERMISSION DENIED</span>

<span class="color-orange">Nice try! But this portfolio is read-only.</span>
<span class="color-gray">Besides, I worked hard on this... please don't delete it 😢</span>

<span class="color-gray">If you want to see my actual work, try:</span>
<span class="color-cyan">  cat resume.txt</span>
<span class="color-cyan">  cd projects && ls</span>
`.trim(),
        html: true,
      };
    }

    if (subCommand.startsWith('apt') || subCommand.startsWith('pacman')) {
      return {
        output: `
<span class="color-orange">📦 Package manager not available</span>
<span class="color-gray">This is a portfolio, not an actual Linux system!</span>
<span class="color-gray">But I do know my way around apt, pacman, and even nix 😎</span>
`.trim(),
        html: true,
      };
    }

    return {
      output: `
<span class="color-orange">[sudo] password for deep:</span> <span class="color-gray">********</span>
<span class="color-red">Sorry, user deep is not in the sudoers file.</span>
<span class="color-gray">This incident will be reported... just kidding! 😄</span>
`.trim(),
      html: true,
    };
  },
};

export const rmCommand: Command = {
  name: 'rm',
  description: 'Remove files (just kidding)',
  usage: 'rm [-rf] <file>',
  execute: (ctx): CommandResult => {
    if (ctx.flags.has('r') || ctx.flags.has('f')) {
      return {
        output: `
<span class="color-red bold">⚠️  WHOA THERE!</span>

<span class="color-gray">I appreciate the chaos energy, but this portfolio is:</span>
<span class="color-green">  ✓ Read-only</span>
<span class="color-green">  ✓ Stateless</span>
<span class="color-green">  ✓ Indestructible</span>

<span class="color-gray">Try 'cat resume.txt' for something more constructive!</span>
`.trim(),
        html: true,
      };
    }

    return {
      output: `<span class="color-gray">rm: cannot remove '${ctx.args[0] || '*'}': Read-only file system</span>`,
      html: true,
    };
  },
};

export const vimCommand: Command = {
  name: 'vim',
  description: 'Open the vim editor',
  usage: 'vim [file]',
  execute: (): CommandResult => {
    return {
      output: `
<span class="color-green bold">~</span>
<span class="color-green bold">~</span>
<span class="color-green bold">~</span>
<span class="color-green bold">~                    VIM - Vi IMproved</span>
<span class="color-green bold">~</span>
<span class="color-green bold">~                    version 9.0</span>
<span class="color-green bold">~</span>
<span class="color-green bold">~             How to exit: :q!</span>
<span class="color-green bold">~</span>
<span class="color-green bold">~     Just kidding, you're already out! 😄</span>
<span class="color-green bold">~</span>
<span class="color-green bold">~  <span class="color-gray">Pro tip: I actually use Neovim btw</span></span>
<span class="color-green bold">~</span>
`.trim(),
      html: true,
    };
  },
};

export const exitCommand: Command = {
  name: 'exit',
  description: 'Exit the terminal',
  usage: 'exit',
  execute: (): CommandResult => {
    return {
      output: `
<span class="color-orange bold">👋 Leaving so soon?</span>

<span class="color-gray">Before you go, have you checked out:</span>
<span class="color-cyan">  • My projects?</span> <span class="color-gray">(cd projects && ls)</span>
<span class="color-cyan">  • My experience?</span> <span class="color-gray">(cd experience && ls)</span>
<span class="color-cyan">  • How to contact me?</span> <span class="color-gray">(cat contact.txt)</span>

<span class="color-gray">Type '</span><span class="color-green">exit!</span><span class="color-gray">' if you really want to leave.</span>
`.trim(),
      html: true,
    };
  },
};

export const exitForceCommand: Command = {
  name: 'exit!',
  description: 'Actually exit (reload page)',
  usage: 'exit!',
  execute: (): CommandResult => {
    setTimeout(() => {
      window.location.reload();
    }, 500);
    return {
      output: `<span class="color-green">Thanks for visiting! Refreshing...</span>`,
      html: true,
    };
  },
};

export const hackCommand: Command = {
  name: 'hack',
  description: 'Initiate hacking sequence',
  usage: 'hack [target]',
  execute: (ctx): CommandResult => {
    const target = ctx.args[0] || 'mainframe';
    return {
      output: `
<span class="color-green">Initiating hack sequence...</span>
<span class="color-cyan">Target: ${target}</span>

<span class="color-green">[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100%</span>

<span class="color-red bold">ACCESS DENIED</span>

<span class="color-gray">Just kidding! I don't actually hack things.</span>
<span class="color-gray">But I do build secure applications! Check out my projects.</span>

<span class="color-orange">Try 'matrix' for some cool visuals instead!</span>
`.trim(),
      html: true,
    };
  },
};

export const matrixCommand: Command = {
  name: 'matrix',
  description: 'Display matrix rain effect',
  usage: 'matrix',
  execute: (): CommandResult => {
    // Create matrix effect
    const canvas = document.createElement('canvas');
    canvas.className = 'matrix-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1000';
    canvas.style.background = 'rgba(0, 0, 0, 0.9)';
    document.body.appendChild(canvas);

    const context = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    let frameCount = 0;
    const maxFrames = 100; // ~8 seconds at 80ms intervals
    let lastUpdate = 0;
    const updateInterval = 80; // Choppy frame rate
    let isRunning = true;

    function draw(timestamp: number) {
      if (!isRunning) return;
      
      // Only update at fixed intervals for choppy/robotic feel
      if (timestamp - lastUpdate < updateInterval) {
        requestAnimationFrame(draw);
        return;
      }
      lastUpdate = timestamp;
      frameCount++;

      context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = '#0F0';
      context.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        context.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      if (frameCount < maxFrames) {
        requestAnimationFrame(draw);
      } else {
        // Fade out and remove
        isRunning = false;
        canvas.style.transition = 'opacity 0.5s';
        canvas.style.opacity = '0';
        setTimeout(() => canvas.remove(), 500);
      }
    }

    requestAnimationFrame(draw);

    // Add click to dismiss
    canvas.addEventListener('click', () => {
      canvas.style.transition = 'opacity 0.3s';
      canvas.style.opacity = '0';
      setTimeout(() => canvas.remove(), 300);
    });

    return {
      output: `<span class="color-green">Matrix mode activated! Click anywhere to exit.</span>`,
      html: true,
    };
  },
};

export const cowsayCommand: Command = {
  name: 'cowsay',
  description: 'Have a cow say something',
  usage: 'cowsay <message>',
  execute: (ctx): CommandResult => {
    const message = ctx.args.join(' ') || 'Hire Deep!';
    const boxWidth = Math.max(message.length + 2, 10);
    const topBorder = ' ' + '_'.repeat(boxWidth);
    const bottomBorder = ' ' + '-'.repeat(boxWidth);
    const padding = ' '.repeat(boxWidth - message.length - 2);

    return {
      output: `
<span class="color-white">${topBorder}</span>
<span class="color-white">< ${message}${padding} ></span>
<span class="color-white">${bottomBorder}</span>
<span class="color-white">        \\   ^__^</span>
<span class="color-white">         \\  (oo)\\_______</span>
<span class="color-white">            (__)\\       )\\/\\</span>
<span class="color-white">                ||----w |</span>
<span class="color-white">                ||     ||</span>
`.trim(),
      html: true,
    };
  },
};
