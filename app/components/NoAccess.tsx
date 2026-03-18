import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";
import { SignInButton } from '@clerk/nextjs'

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
        <h2 className="text-2xl font-semibold tracking-tight text-eshop-textPrimary">
          Acceso Restringido
        </h2>
        <p className="text-sm text-eshop-textSecondary max-w-md">
          {details}
        </p>
      </div>

      <div className="flex gap-3">
        <SignInButton mode='modal'>
          <button className="bg-eshop-buttonBase cursor-pointer px-4 py-2 rounded-md text-sm font-medium text-eshop-textDark hover:bg-eshop-buttonHover hoverEffect">
            <p>Iniciar Sesión</p>
          </button>
        </SignInButton>
        <Link href="/tienda">
          <button className="border cursor-pointer text-eshop-textPrimary border-eshop-goldDeep px-4 py-2 rounded-md text-sm font-medium hover:bg-eshop-formsBackground hoverEffect">
            Ir a la Tienda
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NoAccess;