import dynamic from "next/dynamic";

const DocEditNoSSR = dynamic(() => import("./DocEdit"), { ssr: false });

export default function DocEdit({
  params: { _id },
}: {
  params: { _id: string };
}) {
  return <DocEditNoSSR params={{ _id }} />;
}
