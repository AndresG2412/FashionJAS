import { cn } from "@/lib/utils";

const Title = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2
      className={cn(
        "text-2xl md:text-3xl font-bold text-danashop-brandMain capitalize tracking-wide font-sans",
        className
      )}
    >
      {children}
    </h2>
  );
};
const SubTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={cn("font-semibold text-danashop-textSecondary font-sans text-center uppercase border-b-2", className)}>
      {children}
    </h3>
  );
};

const SubText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <p className={cn("text-danashop-textPrimary text-sm", className)}>{children}</p>;
};
export { Title, SubTitle, SubText };
