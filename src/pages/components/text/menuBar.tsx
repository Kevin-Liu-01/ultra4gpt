import { useTheme } from "next-themes";

import { DropdownMenu, Button, Tooltip, Flex } from "@radix-ui/themes";
import {
  BrainIcon,
  BrainCircuitIcon,
  BrainCogIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react";

export default function ModelDropdown({
  model,
  setModel,
}: {
  model: string;
  setModel: (model: string) => void;
}) {
  const { theme, setTheme } = useTheme();

  const themeHandler = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const ThemeIconHandler = () => {
    if (theme === "light") {
      return <SunIcon />;
    } else {
      return <MoonIcon />;
    }
  };

  const IconHandler = () => {
    if (model === "gpt-3.5-turbo") {
      return <BrainIcon />;
    } else if (model === "gpt-4-turbo" || model === "gpt-4") {
      return <BrainCircuitIcon />;
    } else if (model === "gpt-4o" || model === "gpt-4o-mini") {
      return <BrainCogIcon />;
    }
  };

  return (
    <Flex className="mb-4 w-full gap-3">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Flex
            align="center"
            justify="center"
            className="w-full gap-2 rounded-xl bg-gray-950 px-3 py-2 text-white"
          >
            <IconHandler />
            {model}
            <DropdownMenu.TriggerIcon />
          </Flex>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content color="red">
          <DropdownMenu.Item
            onClick={() => setModel("gpt-3.5-turbo")}
            shortcut="⌘ A"
          >
            gpt-3.5-turbo
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => setModel("gpt-4-turbo")}
            shortcut="⌘ B"
          >
            gpt-4-turbo
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onClick={() => setModel("gpt-4")} shortcut="⌘ C">
            gpt-4
          </DropdownMenu.Item>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>gpt-4o Variants</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={() => setModel("gpt-4o")}>
                gpt-4o
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setModel("gpt-4o-mini")}>
                gpt-4o-mini
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <Flex
        onClick={() => themeHandler()}
        justify="center"
        align="center"
        className="rounded-xl bg-gray-950 p-2 text-white"
      >
        <ThemeIconHandler />
      </Flex>
    </Flex>
  );
}
