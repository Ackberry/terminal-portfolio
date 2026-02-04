import { FileSystem } from './filesystem';
import { commandRegistry } from './commands';
import type { TerminalInterface, CommandContext } from './types';

export class Terminal implements TerminalInterface {
  private container: HTMLElement;
  private inputElement: HTMLInputElement | null = null;
  private cursorElement: HTMLElement | null = null;
  private fs: FileSystem;
  private history: string[] = [];
  private historyIndex: number = -1;
  private currentInput: string = '';

  constructor(container: HTMLElement) {
    this.container = container;
    this.fs = new FileSystem();
    this.init();
  }

  private init(): void {
    this.printWelcome();
    this.createInputLine();
    this.setupGlobalListeners();
  }

  private printWelcome(): void {
    const welcomeText = `<span class="color-gray">Type '<span class="color-cyan">help</span>' to see available commands</span>`;
    this.print(welcomeText, false, true);
  }

  private createInputLine(): void {
    const inputLine = document.createElement('div');
    inputLine.className = 'input-line';

    const prompt = document.createElement('span');
    prompt.className = 'prompt';
    prompt.textContent = this.getPrompt();

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'input-wrapper';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'command-input';
    input.autocomplete = 'off';
    input.autocapitalize = 'off';
    input.spellcheck = false;

    const cursor = document.createElement('span');
    cursor.className = 'cursor';

    inputWrapper.appendChild(input);
    inputWrapper.appendChild(cursor);
    inputLine.appendChild(prompt);
    inputLine.appendChild(inputWrapper);

    this.container.appendChild(inputLine);

    this.inputElement = input;
    this.cursorElement = cursor;

    this.setupInputListeners(input, cursor);
    input.focus();
    this.updateCursorPosition();
  }

  private getPrompt(): string {
    const path = this.fs.getCurrentPath();
    const displayPath = path === '/home/deep' ? '~' : path.replace('/home/deep', '~');
    return `deep@portfolio:${displayPath}$ `;
  }

  private setupInputListeners(input: HTMLInputElement, _cursor: HTMLElement): void {
    input.addEventListener('input', () => {
      this.updateCursorPosition();
    });

    input.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });

    input.addEventListener('blur', () => {
      // Re-focus on click anywhere
      setTimeout(() => {
        if (document.activeElement !== input) {
          input.focus();
        }
      }, 10);
    });
  }

  private setupGlobalListeners(): void {
    // Focus input when clicking anywhere on terminal
    this.container.addEventListener('click', () => {
      this.inputElement?.focus();
    });

    // Handle paste - default behavior works, no custom handling needed
  }

  private updateCursorPosition(): void {
    if (!this.inputElement || !this.cursorElement) return;

    const text = this.inputElement.value;
    const cursorPos = this.inputElement.selectionStart || 0;

    // Create a temporary span to measure text width
    const measureSpan = document.createElement('span');
    measureSpan.style.visibility = 'hidden';
    measureSpan.style.position = 'absolute';
    measureSpan.style.whiteSpace = 'pre';
    measureSpan.style.font = getComputedStyle(this.inputElement).font;
    measureSpan.textContent = text.substring(0, cursorPos);
    document.body.appendChild(measureSpan);

    const width = measureSpan.offsetWidth;
    document.body.removeChild(measureSpan);

    this.cursorElement.style.left = `${width}px`;
  }

  private handleKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        this.executeCommand();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.navigateHistory(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.navigateHistory(1);
        break;
      case 'Tab':
        e.preventDefault();
        this.handleTabCompletion();
        break;
      case 'c':
        if (e.ctrlKey) {
          e.preventDefault();
          this.handleCtrlC();
        }
        break;
      case 'l':
        if (e.ctrlKey) {
          e.preventDefault();
          this.clear();
          this.createInputLine();
        }
        break;
    }

    // Update cursor position after key handling
    setTimeout(() => this.updateCursorPosition(), 0);
  }

  private async executeCommand(): Promise<void> {
    if (!this.inputElement) return;

    const input = this.inputElement.value.trim();
    
    // Print the command line as output
    const commandLine = document.createElement('div');
    commandLine.className = 'output-line';
    commandLine.innerHTML = `<span class="prompt">${this.getPrompt()}</span>${this.escapeHtml(input)}`;
    
    // Replace input line with output
    const inputLine = this.inputElement.closest('.input-line');
    if (inputLine) {
      this.container.replaceChild(commandLine, inputLine);
    }

    // Add to history if not empty
    if (input) {
      this.history.push(input);
      this.historyIndex = this.history.length;
    }

    // Execute command
    if (input) {
      await this.processCommand(input);
    }

    // Create new input line
    this.createInputLine();
    this.scrollToBottom();
  }

  private async processCommand(input: string): Promise<void> {
    const parts = this.parseCommand(input);
    if (parts.length === 0) return;

    const commandName = parts[0].toLowerCase();
    const args: string[] = [];
    const flags = new Set<string>();

    // Parse arguments and flags
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      if (part.startsWith('-')) {
        // Handle flags like -la, -l, -a
        const flagChars = part.substring(1);
        for (const char of flagChars) {
          flags.add(char);
        }
      } else {
        args.push(part);
      }
    }

    const command = commandRegistry.get(commandName);
    if (!command) {
      this.print(`${commandName}: command not found. Type 'help' for available commands.`, true);
      return;
    }

    const context: CommandContext = {
      args,
      flags,
      terminal: this,
      fs: this.fs,
    };

    try {
      const result = await command.execute(context);
      
      if (result.clear) {
        this.clear();
      }
      
      if (result.output) {
        this.print(result.output, result.isError, result.html);
      }
    } catch (error) {
      this.print(`Error executing command: ${error}`, true);
    }
  }

  private parseCommand(input: string): string[] {
    const parts: string[] = [];
    let current = '';
    let inQuote = false;
    let quoteChar = '';

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if ((char === '"' || char === "'") && !inQuote) {
        inQuote = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuote) {
        inQuote = false;
        quoteChar = '';
      } else if (char === ' ' && !inQuote) {
        if (current) {
          parts.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current) {
      parts.push(current);
    }

    return parts;
  }

  private navigateHistory(direction: number): void {
    if (!this.inputElement) return;

    if (this.history.length === 0) return;

    // Save current input when starting to navigate
    if (this.historyIndex === this.history.length) {
      this.currentInput = this.inputElement.value;
    }

    const newIndex = this.historyIndex + direction;

    if (newIndex < 0) {
      this.historyIndex = 0;
    } else if (newIndex >= this.history.length) {
      this.historyIndex = this.history.length;
      this.inputElement.value = this.currentInput;
    } else {
      this.historyIndex = newIndex;
      this.inputElement.value = this.history[this.historyIndex];
    }

    // Move cursor to end
    setTimeout(() => {
      if (this.inputElement) {
        this.inputElement.selectionStart = this.inputElement.value.length;
        this.inputElement.selectionEnd = this.inputElement.value.length;
        this.updateCursorPosition();
      }
    }, 0);
  }

  private handleTabCompletion(): void {
    if (!this.inputElement) return;

    const input = this.inputElement.value;
    const parts = input.split(' ');
    
    if (parts.length === 1) {
      // Complete command name
      const partial = parts[0].toLowerCase();
      const commands = Array.from(commandRegistry.keys());
      const matches = commands.filter(cmd => cmd.startsWith(partial));
      
      if (matches.length === 1) {
        this.inputElement.value = matches[0] + ' ';
        this.updateCursorPosition();
      } else if (matches.length > 1) {
        // Show all matches
        this.print(matches.join('  '));
      }
    } else {
      // Complete file/directory path
      const partial = parts[parts.length - 1];
      const completions = this.fs.getCompletions(partial);
      
      if (completions.length === 1) {
        parts[parts.length - 1] = completions[0];
        this.inputElement.value = parts.join(' ');
        this.updateCursorPosition();
      } else if (completions.length > 1) {
        // Show all matches
        this.print(completions.join('  '));
      }
    }
  }

  private handleCtrlC(): void {
    if (!this.inputElement) return;
    
    // Print current line with ^C
    const commandLine = document.createElement('div');
    commandLine.className = 'output-line';
    commandLine.innerHTML = `<span class="prompt">${this.getPrompt()}</span>${this.escapeHtml(this.inputElement.value)}^C`;
    
    const inputLine = this.inputElement.closest('.input-line');
    if (inputLine) {
      this.container.replaceChild(commandLine, inputLine);
    }

    this.createInputLine();
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private scrollToBottom(): void {
    this.container.scrollTop = this.container.scrollHeight;
  }

  // Public interface methods
  public getHistory(): string[] {
    return [...this.history];
  }

  public print(text: string, isError: boolean = false, isHtml: boolean = false): void {
    const lines = text.split('\n');
    
    for (const line of lines) {
      const outputLine = document.createElement('div');
      outputLine.className = 'output-line' + (isError ? ' error' : '');
      
      if (isHtml) {
        outputLine.innerHTML = line;
      } else {
        outputLine.textContent = line;
      }
      
      // Insert before the input line if it exists
      const inputLine = this.container.querySelector('.input-line');
      if (inputLine) {
        this.container.insertBefore(outputLine, inputLine);
      } else {
        this.container.appendChild(outputLine);
      }
    }
    
    this.scrollToBottom();
  }

  public clear(): void {
    // Remove all children except we'll create new input
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
  }
}
