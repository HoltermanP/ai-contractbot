import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Security | Contractbot",
  description:
    "Informatie over onze veilige omgeving, Europese en afgeschermde server, privacy (AVG) en algemene voorwaarden.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
