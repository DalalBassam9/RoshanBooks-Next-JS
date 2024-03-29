import React from 'react';
import type { Metadata } from 'next'
import Navigation from '../components/Navigation';
import HeaderSection from '../components/HeaderSection';
import Footer from '../components/Footer';
import { Inter } from 'next/font/google'
import { Provider } from 'react-redux';
import { useLayoutEffect } from 'react';
import { Providers } from "../redux/provider";
import store from '../redux/store';
import './globals.css';
import { Inter as NextInter } from 'next/font/google';

const inter = NextInter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Roshan Books',
  description: 'Roshan is a Books store to buy books in Arabic and English',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <Providers>
          {children}
        </Providers>

      </body>
    </html>
  )
}
