import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Edit products',
    description: 'Edit details of existing product',
}

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
        {children}
    </>
  );
}
