import { Flex } from "@radix-ui/themes";

export default function FilePreview() {
  return (
    <Flex direction="column" className="rounded-xl bg-gray-950 p-3">
      <p className="text-4xl font-extrabold text-white">
        ULTRA<span className="text-red-600">4</span>GPT
      </p>
      <p className="text-sm text-white">
        This is a tool used to access OpenAI's API (for those sweet unlimited
        credits). Enter your API key to get started. This is a demo project by{" "}
        <a
          href="https://github.com/Kevin-Liu-01"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400"
        >
          @Kevin-Liu-01
        </a>
      </p>
    </Flex>
  );
}
