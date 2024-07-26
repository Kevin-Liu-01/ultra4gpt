// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { Tooltip } from "@radix-ui/themes";
import { ReactNode } from "react";

interface CameraButtonProps<T> {
  message: string;
  setState: React.Dispatch<React.SetStateAction<T>>;
  state: T;
  component: ReactNode;
}

export default function CameraButton<T>({
  message,
  setState,
  state,
  component,
}: CameraButtonProps<T>) {
  return (
    <Tooltip content={message}>
      <button
        className="border-dark hover:bg-primary rounded-md border p-2 duration-150"
        onClick={() => setState(state)}
      >
        {component}
      </button>
    </Tooltip>
  );
}
