// Container.tsx
type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({ children, className }: Props) {
  return (
    // <div className={`mx-auto max-w-7xl px-2 sm:px-6 lg:px-0 ${className}`}>
    <div className={`px-2 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}