import { NotFoundPage } from '@payloadcms/next/views'
import type { SanitizedConfig } from 'payload'
import config from '@payload-config'
import { importMap } from '../importMap'

const configPromise = Promise.resolve(config as unknown as SanitizedConfig)

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config: configPromise, params, searchParams, importMap })

export default NotFound
