import { cn } from '@/lib/utils';

const variantStyles: Record<string, string> = {
  default: 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20',
  blue: 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20',
  green: 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20',
  yellow: 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20',
  red: 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20',
  purple: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20',
  gray: 'bg-[#1F2937] text-[#94A3B8] border border-[#1F2937]',
};

const sizeStyles: Record<string, string> = {
  xs: 'px-1.5 py-0.5 text-[10px]',
  sm: 'px-2.5 py-1 text-[11px]',
  md: 'px-3 py-1 text-xs',
};

export function Badge({
  className, variant = 'default', size = 'sm', ...props
}: {
  variant?: string; size?: string; className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium tracking-wide transition-colors',
        variantStyles[variant] || variantStyles.default,
        sizeStyles[size] || sizeStyles.sm,
        className,
      )}
      {...props}
    />
  );
}