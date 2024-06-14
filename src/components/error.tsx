import React from "react"
import { useScrollInhibitor } from "../hooks"

interface VistaErrorProps {
    error: Error | null,
    message: string,
    title?: string
}
const VistaError = (props: VistaErrorProps) => {
    const featuresColor = "#0abbef"
    
    return (
        <div style={{
            display: "flex",
            position: "absolute",
            flexDirection: "column",
            top: "0px",
            left: "0px",
            right: "0px",
            bottom: "0px",
            alignItems: "center",
            justifyContent: "center",
        }}>
        <svg style={{
                width: "300px",
                height: "300px",
            }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#0abbef" strokeWidth="8" fill={"#252243"}/>
            <circle cx="35" cy="40" r="5" fill={featuresColor}/>
            <circle cx="65" cy="40" r="5" fill={featuresColor}/>
            <path d="M 30 70 Q 50 55 70 70" stroke={featuresColor} strokeWidth="6" fill="none"/>
        </svg>
        <div className="block">
            <div className="is-size-2">{props.title || "Something went wrong!"}</div>
        </div>
        <div className="block">
            <div className="is-size-8">{props.message}</div>
            
        </div>
        <div className="is-size-8 has-text-danger">{props?.error?.toString()}</div>
        </div>
    )
}

interface VistaErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorMessage: string;
}
interface VistaErrorBoundaryProps {
    errorMessage?: string;
    children?: React.ReactNode;
}
class VistaErrorBoundary extends React.Component<VistaErrorBoundaryProps, VistaErrorBoundaryState> {
    constructor(props: VistaErrorBoundaryProps) {
        super(props);
        this.state = { 
            hasError: false,
            error: null,
            errorMessage: props?.errorMessage || "Oh no! Something went wrong."
        };
    }
  
    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error: error };
    }
  
    componentDidCatch(error: Error, _errorInfo: React.ErrorInfo) {
      console.error(error)
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <VistaError error={this.state.error} message={this.state.errorMessage}/>
      }
  
      return this.props.children; 
    }
  }

const Error404 = () => {
    useScrollInhibitor(true)
    const message = `The path "${window.location.pathname}" does not exist.`

    return (
        <VistaError error={null} title="That's a 404!" message={message} />
    )
}


export { VistaErrorBoundary, VistaError, Error404 }