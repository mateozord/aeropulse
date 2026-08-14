import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

/**
 * Last-resort safety net: React only lets class components catch render
 * errors. Without this, any unexpected crash (e.g. a misconfigured service)
 * unmounts the whole tree and leaves a blank page with no explanation.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("AeroPulse crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-base px-6 text-center">
          <p className="text-sm uppercase tracking-wider text-attention">Something went wrong</p>
          <p className="max-w-sm text-sm text-muted">
            AeroPulse hit an unexpected error. Reloading the page usually fixes it.
          </p>
          <a href="/" className="mt-2 text-sm text-accent hover:underline">
            Reload
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}
