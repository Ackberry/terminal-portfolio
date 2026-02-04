import type { FSNode, FileSystemInterface } from '../types';
import {
  aboutContent,
  contactContent,
  skillsContent,
  cacheaiContent,
  usfRareContent,
  talkioContent,
  cinetuneContent,
  askabullContent,
  spotifyMcpContent,
  gdgContent,
  resumeContent,
} from './data';

export class FileSystem implements FileSystemInterface {
  private root: FSNode;
  private currentPath: string = '/home/deep';

  constructor() {
    this.root = this.buildFileSystem();
  }

  private buildFileSystem(): FSNode {
    // Create the file system tree
    const root: FSNode = {
      name: '',
      type: 'directory',
      children: new Map(),
    };

    // /home
    const home: FSNode = {
      name: 'home',
      type: 'directory',
      children: new Map(),
    };

    // /home/deep (user home directory)
    const deep: FSNode = {
      name: 'deep',
      type: 'directory',
      children: new Map(),
    };

    // Files in home directory
    deep.children!.set('about.txt', {
      name: 'about.txt',
      type: 'file',
      content: aboutContent,
    });

    deep.children!.set('contact.txt', {
      name: 'contact.txt',
      type: 'file',
      content: contactContent,
    });

    deep.children!.set('skills.txt', {
      name: 'skills.txt',
      type: 'file',
      content: skillsContent,
    });

    deep.children!.set('resume.txt', {
      name: 'resume.txt',
      type: 'file',
      content: resumeContent,
    });

    // experience/ directory
    const experience: FSNode = {
      name: 'experience',
      type: 'directory',
      children: new Map(),
    };
    experience.children!.set('cacheai.txt', {
      name: 'cacheai.txt',
      type: 'file',
      content: cacheaiContent,
    });
    experience.children!.set('usf-rare.txt', {
      name: 'usf-rare.txt',
      type: 'file',
      content: usfRareContent,
    });
    deep.children!.set('experience', experience);

    // projects/ directory
    const projects: FSNode = {
      name: 'projects',
      type: 'directory',
      children: new Map(),
    };
    projects.children!.set('talkio.txt', {
      name: 'talkio.txt',
      type: 'file',
      content: talkioContent,
    });
    projects.children!.set('cinetune.txt', {
      name: 'cinetune.txt',
      type: 'file',
      content: cinetuneContent,
    });
    projects.children!.set('askabull.txt', {
      name: 'askabull.txt',
      type: 'file',
      content: askabullContent,
    });
    projects.children!.set('spotify-mcp.txt', {
      name: 'spotify-mcp.txt',
      type: 'file',
      content: spotifyMcpContent,
    });
    deep.children!.set('projects', projects);

    // leadership/ directory
    const leadership: FSNode = {
      name: 'leadership',
      type: 'directory',
      children: new Map(),
    };
    leadership.children!.set('gdg.txt', {
      name: 'gdg.txt',
      type: 'file',
      content: gdgContent,
    });
    deep.children!.set('leadership', leadership);

    // Build the tree
    home.children!.set('deep', deep);
    root.children!.set('home', home);

    return root;
  }

  public getCurrentPath(): string {
    return this.currentPath;
  }

  public setCurrentPath(path: string): boolean {
    const resolvedPath = this.resolvePath(path);
    const node = this.getNode(resolvedPath);
    
    if (node && node.type === 'directory') {
      this.currentPath = resolvedPath;
      return true;
    }
    return false;
  }

  public resolvePath(path: string): string {
    // Handle home directory shortcut
    if (path === '~' || path === '') {
      return '/home/deep';
    }
    
    if (path.startsWith('~/')) {
      path = '/home/deep/' + path.substring(2);
    }

    // Handle absolute vs relative paths
    let parts: string[];
    if (path.startsWith('/')) {
      parts = path.split('/').filter(p => p !== '');
    } else {
      parts = [...this.currentPath.split('/').filter(p => p !== ''), ...path.split('/').filter(p => p !== '')];
    }

    // Resolve . and ..
    const resolved: string[] = [];
    for (const part of parts) {
      if (part === '..') {
        resolved.pop();
      } else if (part !== '.') {
        resolved.push(part);
      }
    }

    return '/' + resolved.join('/');
  }

  public getNode(path: string): FSNode | null {
    const resolvedPath = path.startsWith('/') ? path : this.resolvePath(path);
    const parts = resolvedPath.split('/').filter(p => p !== '');

    let current: FSNode = this.root;
    for (const part of parts) {
      if (current.type !== 'directory' || !current.children) {
        return null;
      }
      const next = current.children.get(part);
      if (!next) {
        return null;
      }
      current = next;
    }

    return current;
  }

  public listDirectory(path: string): FSNode[] | null {
    const node = this.getNode(path);
    if (!node || node.type !== 'directory' || !node.children) {
      return null;
    }

    const entries = Array.from(node.children.values());
    // Sort: directories first, then alphabetically
    return entries.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }

  public readFile(path: string): string | null {
    const node = this.getNode(path);
    if (!node || node.type !== 'file') {
      return null;
    }
    return node.content || '';
  }

  public isDirectory(path: string): boolean {
    const node = this.getNode(path);
    return node !== null && node.type === 'directory';
  }

  public isFile(path: string): boolean {
    const node = this.getNode(path);
    return node !== null && node.type === 'file';
  }

  public getCompletions(partial: string): string[] {
    // Handle path completion
    let dirPath: string;
    let prefix: string;

    if (partial.includes('/')) {
      const lastSlash = partial.lastIndexOf('/');
      dirPath = partial.substring(0, lastSlash) || '/';
      prefix = partial.substring(lastSlash + 1);
    } else {
      dirPath = this.currentPath;
      prefix = partial;
    }

    // Handle ~ in path
    if (dirPath === '~') {
      dirPath = '/home/deep';
    } else if (dirPath.startsWith('~/')) {
      dirPath = '/home/deep' + dirPath.substring(1);
    }

    const entries = this.listDirectory(dirPath);
    if (!entries) {
      return [];
    }

    const matches = entries
      .filter(entry => entry.name.toLowerCase().startsWith(prefix.toLowerCase()))
      .map(entry => {
        const basePath = partial.includes('/') 
          ? partial.substring(0, partial.lastIndexOf('/') + 1)
          : '';
        const suffix = entry.type === 'directory' ? '/' : '';
        return basePath + entry.name + suffix;
      });

    return matches;
  }
}
