import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ApiKeysRedirectPage({ params }: Props) {
  const { id } = await params;
  redirect(`/dashboard/applications/${id}?tab=keys`);
}
