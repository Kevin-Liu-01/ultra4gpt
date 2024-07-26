import { Flex, Box, Text, Avatar } from "@radix-ui/themes";
import { UserRoundPenIcon, PaperclipIcon, CameraIcon } from "lucide-react";
import { Key } from "react";

import { useSession } from "next-auth/react";

export default function UserBubble({
  item,
  index,
}: {
  item: any;
  index: Key | null | undefined;
}) {
  const { data: session } = useSession();

  return (
    <Flex
      key={index}
      direction="column"
      className="relative ml-16 max-w-xl gap-4 rounded-xl bg-white/10 p-4 text-white shadow sm:ml-auto"
    >
      <Box className="absolute right-[-1.5rem] top-7 h-0 w-0 rotate-[-90deg] border-l-[1rem] border-r-[1rem] border-t-[1rem] border-l-transparent border-r-transparent border-t-red-500"></Box>
      <Flex gap="3" direction="row" className="ml-auto">
        <Text className="text-2xl font-bold">
          {session ? session.user.name : "Guest"}
        </Text>
        <Avatar
          radius="large"
          variant="solid"
          color="orange"
          highContrast
          src={session?.user?.image || ""}
          fallback={<UserRoundPenIcon />}
        />
      </Flex>
      <div className="scrollbar overflow-auto text-lg">{item.prompt}</div>
      {item.file && (
        <Flex align="center" className="gap-3 rounded-md bg-gray-700 p-2">
          {item.file === "Your Picture" ? <CameraIcon /> : <PaperclipIcon />}{" "}
          {item.file}
        </Flex>
      )}
    </Flex>
  );
}
