interface BrainIconProps {
  className?: string;
}

export default function BrainIcon({ className = "w-6 h-6" }: BrainIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 .5.1 1 .2 1.4C6.1 8.5 5 10 5 11.8c0 1.5.8 2.8 2 3.5-.1.4-.2.8-.2 1.2C6.8 18.5 8.8 21 12 22c3.2-1 5.2-3.5 5.2-5.5 0-.4-.1-.8-.2-1.2 1.2-.7 2-2 2-3.5 0-1.8-1.1-3.3-2.7-3.9.1-.4.2-.9.2-1.4C16.5 4 14.5 2 12 2z" />
      <path d="M12 2v20" />
      <path d="M7.7 7.9C9 8.7 10.4 9 12 9s3-.3 4.3-1.1" />
      <path d="M7 15.3c1.4-.8 3-1.3 5-1.3s3.6.5 5 1.3" />
    </svg>
  );
}
