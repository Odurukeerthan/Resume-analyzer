import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Unknown error";
      try {
        if (this.state.error) {
          if (typeof this.state.error === 'string') {
            errorMessage = this.state.error;
          } else if (this.state.error.message) {
            errorMessage = this.state.error.message;
          } else if (this.state.error.toString) {
            errorMessage = this.state.error.toString();
          }
        }
      } catch (e) {
        console.error("Error formatting error message:", e);
      }

      return (
        <div className="min-h-screen bg-bgDark flex items-center justify-center text-white">
          <div className="bg-cardDark border border-cardStroke rounded-xl p-8 max-w-md">
            <h2 className="text-xl font-bold text-red-400 mb-4">Something went wrong</h2>
            <p className="text-gray-400 mb-4 text-sm">{errorMessage}</p>
            <details className="mb-4 text-xs text-gray-500">
              <summary className="cursor-pointer mb-2">Technical Details</summary>
              <pre className="overflow-auto max-h-40 bg-black/50 p-2 rounded">
                {this.state.errorInfo?.componentStack || "No stack trace available"}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="bg-neonCyan text-black px-4 py-2 rounded hover:bg-neonCyan/80"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
