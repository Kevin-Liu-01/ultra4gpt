import { useRouter } from "next/navigation";
export default function removeImage() {
  const router = useRouter();
  router.replace("/", undefined);
}
