interface DebouncerOptions {
  timeout?: NodeJS.Timeout;
  delay: number;
}

class Debouncer implements DebouncerOptions {
  delay: number;
  timeout?: NodeJS.Timeout;

  constructor(options?: DebouncerOptions) {
    const { delay = 500 } = options || {};
    this.delay = delay;
  }

  exec(fn: () => void) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(fn, this.delay);
  }
}

export default Debouncer;
