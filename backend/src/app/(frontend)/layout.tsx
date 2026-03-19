import React from 'react'

export const metadata = {
  title: 'Shiloh Hub',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
