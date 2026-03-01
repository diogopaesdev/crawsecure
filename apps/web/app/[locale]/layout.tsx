import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Providers } from "@/components/providers";
import { routing } from "@/i18n/routing";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const [messages, session] = await Promise.all([
    getMessages(),
    getServerSession(authOptions),
  ]);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Providers session={session}>
        {children}
      </Providers>
    </NextIntlClientProvider>
  );
}
