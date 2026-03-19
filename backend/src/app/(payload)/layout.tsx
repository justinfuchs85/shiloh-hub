import type React from 'react'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import config from '@payload-config'
import { importMap } from './admin/importMap'

type Args = {
  children: React.ReactNode
}

const serverFunction = async (args: Parameters<typeof handleServerFunctions>[0]) => {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

const Layout = ({ children }: Args) =>
  RootLayout({ children, config, importMap, serverFunction })

export default Layout
