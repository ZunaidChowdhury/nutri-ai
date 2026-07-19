import { Spinner } from '@/components/feedback/Spinner';

interface AgentLoadingStateProps {
  agentName: string;
}

export function AgentLoadingState({ agentName }: AgentLoadingStateProps) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-primary-50 dark:bg-primary-500/10 text-sm text-primary-600 dark:text-primary-400">
      <Spinner label={`${agentName} Agent is thinking…`} />
    </div>
  );
}
