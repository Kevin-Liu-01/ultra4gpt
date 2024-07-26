export default function modelSwitcher(
  file: File | null,
  model: string,
  setModel: (model: string) => void,
) {
  if (file && model !== "gpt-4o-mini" && model !== "gpt-4o") {
    setModel("gpt-4o-mini");
  }
  return "gpt-4o-mini";
}
