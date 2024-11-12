import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

const SettingsPage = () => {
  return (
    <div className="flex flex-col items-center justify-start gap-2 px-4 pt-12 md:gap-4">
      <div className="mb-6 flex items-center gap-4 md:gap-6">
        <div className="relative h-28 w-28 md:h-48 md:w-48">
          <Image
            src="https://github.com/shadcn.png"
            alt="avatar"
            fill
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col items-start justify-start gap-2">
          <h1 className="text-4xl font-semibold md:text-6xl">John Doe</h1>
          <h3 className="text-lg font-normal md:text-2xl">Romania</h3>
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-normal">
              Urmaritori <span className="font-semibold text-primary">100</span>
            </h3>
            <h3 className="text-lg font-normal">
              Urmariti <span className="font-semibold text-primary">100</span>
            </h3>
          </div>
        </div>
      </div>
      <form className="flex w-full flex-col items-center justify-center gap-2">
        <div className="flex flex-col items-start justify-start gap-2">
          <h1 className="text-2xl font-semibold">Nume</h1>
          <StyledInput placeholder="Nume" className="w-full" />
        </div>
        <div className="flex flex-col items-start justify-start gap-2">
          <h1 className="text-2xl font-semibold">Prenume</h1>
          <StyledInput placeholder="Prenume" className="w-full" />
        </div>
        <div className="flex flex-col items-start justify-start gap-2">
          <h1 className="text-2xl font-semibold">Email</h1>
          <StyledInput placeholder="Email" className="w-full" />
        </div>
        <div className="flex flex-col items-start justify-start gap-2">
          <h1 className="text-2xl font-semibold">Locatie</h1>
          <StyledInput placeholder="Locatie" className="w-full" />
        </div>
        <div className="flex w-full max-w-96 flex-col items-start justify-start gap-2">
          <h1 className="text-2xl font-semibold">Bio</h1>
          <div className="relative w-full">
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary to-secondary"></div>
            <Textarea className="relative m-[1px] min-h-32 w-[calc(100%-2px)] bg-background" />
          </div>
        </div>
        <div className="mt-2 flex w-full max-w-96 items-center justify-end">
          <Button className="bg-primary px-8 py-6 text-xl font-bold text-background hover:bg-primary/80">
            Salveaza
          </Button>
        </div>
      </form>
    </div>
  );
};

const StyledInput = ({
  placeholder,
  className,
}: {
  placeholder: string;
  className: string;
}) => {
  return (
    <div className={cn("relative w-full md:w-96", className)}>
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary to-secondary"></div>
      <Input
        placeholder={placeholder}
        className="relative m-[1px] w-[calc(100%-2px)] bg-background"
      />
    </div>
  );
};

export default SettingsPage;
