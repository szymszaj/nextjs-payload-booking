import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import type { SanitizedConfig } from 'payload'
import config from '@payload-config'
import { importMap } from '../importMap'

const configPromise = Promise.resolve(config as unknown as SanitizedConfig)

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Args) =>
  generatePageMetadata({ config: configPromise, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config: configPromise, params, searchParams, importMap })

export default Page
