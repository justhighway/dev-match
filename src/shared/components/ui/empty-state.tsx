interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-muted-foreground flex h-40 w-full items-center justify-center rounded-2xl border border-dashed text-sm">
      {message}
    </div>
  );
}
