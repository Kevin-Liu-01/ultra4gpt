import { Flex, Box, Text } from "@radix-ui/themes";
import Image from "next/image";
import Typewriter from "typewriter-effect";

export default function DefaultBubble(model: { model: string }) {
  return (
    <Flex
      direction="column"
      className="relative flex max-w-xl gap-4 rounded-xl bg-white/10 p-4 text-white"
    >
      <Box className="absolute left-[-1.5rem] top-7 h-0 w-0 rotate-90 border-l-[1rem] border-r-[1rem] border-t-[1rem] border-l-transparent border-r-transparent border-t-red-500"></Box>
      <Flex gap="3" direction="row">
        <Box className="relative size-10 rounded-lg bg-white">
          <Image src="/assets/openai.png" alt="OpenAI" fill className="p-1" />
        </Box>
        <Text className="text-2xl font-bold">{model.model}</Text>
      </Flex>
      <div className="text-lg">
        <Typewriter
          options={{
            loop: false,
            delay: 20,
            cursor: "",
            autoStart: true,
            strings:
              "Hi! I'm ChatGPT. Write anything or upload anything below to get started.",
          }}
        />
      </div>
    </Flex>
  );
}
