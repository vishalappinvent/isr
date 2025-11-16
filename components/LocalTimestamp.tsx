import { useEffect, useState } from 'react';

interface LocalTimestampProps {
  isoString: string;
}

export default function LocalTimestamp({ isoString }: LocalTimestampProps) {
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    // Format date in browser's local timezone
    const date = new Date(isoString);
    const formatted = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    }).format(date);
    
    setFormattedDate(formatted);
  }, [isoString]);

  if (!formattedDate) {
    return <span className="text-base font-mono text-blue-900 dark:text-blue-200">Loading...</span>;
  }

  return (
    <span className="text-base font-mono text-blue-900 dark:text-blue-200">
      {formattedDate}
    </span>
  );
}

