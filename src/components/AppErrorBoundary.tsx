import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App failed to render", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-6 text-center">
        <div className="max-w-md space-y-4 rounded-2xl border bg-card p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-foreground">Something did not load correctly.</h1>
          <p className="text-muted-foreground">
            Please refresh the page. If this happens after uploading, make sure the newest build files were uploaded to Hostinger.
          </p>
          <Button onClick={() => window.location.assign("./")}>Reload Home</Button>
        </div>
      </main>
    );
  }
}