import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  details: string;
}

const NoAccess = ({ details }: Props) => {
  return (
    <div className="flex min-h-125 flex-col items-center justify-center space-y-6 px-4 text-center">
      <div className="relative mb-4">
        <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-red-500/20" />
        <ShieldAlert className="h-16 w-16 text-red-500" strokeWidth={1.5} />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Acceso Restringido
        </h2>
        <p className="text-sm text-gray-600 max-w-md">
          {details}
        </p>
      </div>

      <div className="flex gap-3">
        <Button asChild variant="default">
          <Link href="/sign-in">Iniciar Sesión</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/tienda">Ir a la Tienda</Link>
        </Button>
      </div>
    </div>
  );
};

export default NoAccess;