import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface ProcessingStepsProps {
  steps: ProcessingStep[];
  currentStep: string;
}

export const ProcessingSteps = ({ steps, currentStep }: ProcessingStepsProps) => {
  const getStepIcon = (step: ProcessingStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStepStatus = (step: ProcessingStep) => {
    switch (step.status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700 mb-4">Etapas do Processamento</h4>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-start gap-3 p-3 rounded-lg border ${getStepStatus(step)} transition-all duration-200`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getStepIcon(step)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium">{step.title}</h5>
                {step.status === 'processing' && (
                  <span className="text-xs text-blue-600 font-medium">Em andamento...</span>
                )}
              </div>
              <p className="text-xs mt-1 opacity-80">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 