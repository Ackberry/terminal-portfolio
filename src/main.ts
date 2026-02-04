import './styles/termux.css';
import { Terminal } from './terminal';

// Initialize terminal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const terminalElement = document.getElementById('terminal');
  if (terminalElement) {
    new Terminal(terminalElement);
  }
});
