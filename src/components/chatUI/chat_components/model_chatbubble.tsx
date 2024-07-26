import { Flex, Box, Text } from "@radix-ui/themes";
import Image from "next/image";
import MarkdownViewer from "./markdown_viewer";

export default function ModelBubble({
  item,
}: {
  item: {
    prompt: string;
    file: string;
    response: string;
    model: string;
  };
}) {
  return (
    <Flex
      direction="column"
      className="relative mr-12 flex max-w-xl gap-4 rounded-xl bg-white/10 p-4 text-white shadow sm:mr-0"
    >
      <Box className="absolute left-[-1.5rem] top-7 h-0 w-0 rotate-90 border-l-[1rem] border-r-[1rem] border-t-[1rem] border-l-transparent border-r-transparent border-t-red-500"></Box>
      <Flex gap="3" direction="row">
        <Box className="relative size-10 rounded-lg bg-white">
          <Image src="/assets/openai.png" alt="OpenAI" fill className="p-1" />
        </Box>
        <Text className="text-2xl font-bold">{item?.model}</Text>
      </Flex>
      <div className="scrollbar w-full overflow-auto text-lg">
        <MarkdownViewer markdown={item?.response || ""} />
      </div>
    </Flex>
  );
}
