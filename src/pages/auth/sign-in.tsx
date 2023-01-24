import type { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { useSession } from "next-auth/react";

import { getProviders, signIn } from "next-auth/react";

import { useEffect, useState } from "react";
import type { DOMAttributes } from "react";
import { MdWavingHand } from "react-icons/md";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import type { BuiltInProviderType } from "next-auth/providers";
import { useRouter } from "next/router";
import LoadingScreen from "../../components/LoadingScreen";

interface SignInWrapperProps {
  children: React.ReactNode;
}

const SignInWrapper = ({ children }: SignInWrapperProps) => {
  return <div className="flex flex-col gap-8">{children}</div>;
};

interface ButtonProps extends DOMAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

const Button = ({
  children,
  className = "",
  variant = "primary",
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={`flex items-center justify-center px-4 py-2 shadow-md focus:outline-none ${
        variant === "primary"
          ? "bg-orange-600 text-white active:bg-orange-500"
          : "zinc-900 bg-white font-bold active:bg-zinc-200"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

const SignInPage = () => {
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>();

  const router = useRouter();

  const { data: sessionData, status } = useSession();

  useEffect(() => {
    getProviders()
      .then((providers) => setProviders(providers))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (sessionData?.user) {
      router
        .push(
          typeof router.query.callbackUrl === "string"
            ? router.query.callbackUrl
            : "/"
        )
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  }, [sessionData, router]);

  if (providers === undefined || status === "loading") {
    return <LoadingScreen />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-50 p-4">
      <div className="relative flex w-full max-w-md bg-white p-4 shadow-lg shadow-zinc-400">
        <SignInWrapper>
          <div className="flex gap-1 text-4xl font-bold text-zinc-700">
            <div>Welcome</div>
            <MdWavingHand />
          </div>
          <div className="font-light text-zinc-700">
            <span className="font-bold text-orange-600">Zpaceway Academy </span>
            is the best place to learn about Software Development. We have top
            tier level teachers from all around the world, with real
            professional experience in the industry.
          </div>
          <div className="flex">
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  providers?.google.id && signIn(providers.google.id);
                }}
              >
                <div className="flex items-center gap-1">
                  <div>Sign in with Google</div>
                  <FaGoogle />
                </div>
              </Button>
              <Button>
                <div className="flex items-center gap-1">
                  <div>Sign in with Facebook</div>
                  <FaFacebook />
                </div>
              </Button>
            </div>
          </div>
        </SignInWrapper>
        <div className="absolute -bottom-24 text-center text-sm text-zinc-400">
          {"Don't"} have an account yet? No problem! You can just click on sign
          in and we will create one for you. If you have any questions please
          let us know by clicking{" "}
          <Link href="/contact" className="font-bold text-orange-600">
            here
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
