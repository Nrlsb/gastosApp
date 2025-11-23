import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
    // Optionally, use a toast to notify the user
    if (this.props.showToast) {
      this.props.showToast("Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo más tarde.", "danger");
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">¡Algo salió mal!</h4>
          <p>Lo sentimos, ha ocurrido un error inesperado en la aplicación.</p>
          {this.props.showDetails && this.state.error && (
            <details className="mt-2">
              <summary>Detalles del error</summary>
              <pre className="text-break">
                {this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          {this.props.fallbackComponent ? this.props.fallbackComponent : <p>Por favor, recargue la página o inténtelo de nuevo más tarde.</p>}
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  showDetails: PropTypes.bool,
  fallbackComponent: PropTypes.node,
  showToast: PropTypes.func, // Function to show a toast, typically from ToastContext
};

ErrorBoundary.defaultProps = {
  showDetails: process.env.NODE_ENV === 'development', // Show details only in development
  fallbackComponent: null,
  showToast: null,
};

export default ErrorBoundary;
