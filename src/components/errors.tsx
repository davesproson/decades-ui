import React from "react"
import { useScrollInhibitor } from "../hooks"

interface VistaErrorProps {
    error: Error | null,
    message: string,
    title?: string
}
const DecadesError = (props: VistaErrorProps) => {
    const featuresColor = "#0abbef"
    
    return (
        <div className="absolute flex flex-col inset-0 items-center justify-center">
        <svg className="w-[15em]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#0abbef" strokeWidth="8" fill={"#252243"}/>
            <circle cx="35" cy="40" r="5" fill={featuresColor}/>
            <circle cx="65" cy="40" r="5" fill={featuresColor}/>
            <path d="M 30 70 Q 50 55 70 70" stroke={featuresColor} strokeWidth="6" fill="none"/>
        </svg>
        <div className="text-[2em] mt-2">{props.title || "Something went wrong!"}</div>
        <div className="text-muted-foreground mt-4 text-[1.5em]">{props.message}</div>
            
        <div className="text-sm text-destructive mt-4">{props?.error?.toString()}</div>
        <div className="fixed bottom-4 m-auto text-muted-foreground text-sm">FAAM Airborne Laboratory</div>
        </div>
    )
}

interface DecadesErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorMessage: string;
}
interface DecadesErrorBoundaryProps {
    errorMessage?: string;
    children?: React.ReactNode;
}
class DecadesErrorBoundary extends React.Component<DecadesErrorBoundaryProps, DecadesErrorBoundaryState> {
    constructor(props: DecadesErrorBoundaryProps) {
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
        return <DecadesError error={this.state.error} message={this.state.errorMessage}/>
      }
  
      return this.props.children; 
    }
  }

const Error404 = () => {
    useScrollInhibitor(true)
    const message = `The path "${window.location.pathname}" does not exist.`

    return (
        <DecadesError error={null} title="That's a 404!" message={message} />
    )
}


export { DecadesErrorBoundary as VistaErrorBoundary, DecadesError as VistaError, Error404 }