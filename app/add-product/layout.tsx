import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Add products',
    description: 'Add a new product ',
}

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
        {children}
    </>
  );
}
