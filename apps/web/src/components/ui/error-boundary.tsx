import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorDisplay } from "./error-display";

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: (props: { error: Error; reset: () => void }) => ReactNode;
}

interface ErrorBoundaryState {
	error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = { error: null };

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { error };
	}

	componentDidCatch(error: Error, _info: ErrorInfo) {
		console.error("ErrorBoundary caught:", error);
	}

	handleReset = () => {
		this.setState({ error: null });
	};

	render() {
		if (this.state.error) {
			if (this.props.fallback) {
				return this.props.fallback({ error: this.state.error, reset: this.handleReset });
			}
			return <ErrorDisplay message={this.state.error.message} onRetry={this.handleReset} />;
		}
		return this.props.children;
	}
}

export { ErrorBoundary };
