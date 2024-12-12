import dynamic from "next/dynamic";

const DocEditNoSSR = dynamic(() => import("./DocEdit"), { ssr: false });

export default async function DocEdit(props: {
  params: Promise<{ _id: string }>;
}) {
  const params = await props.params;

  const { _id } = params;

  return <DocEditNoSSR params={{ _id }} />;
}
