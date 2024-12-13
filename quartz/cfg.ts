import { ValidDateType } from "./components/Date"
import { PluginTypes } from "./plugins/types"

export type Analytics =
  | null
  | {
    provider: "plausible"
    host?: string
  }
  | {
    provider: "google"
    tagId: string
  }
  | {
    provider: "umami"
    websiteId: string
    host?: string
  }

export interface GlobalConfiguration {
  /** Glob patterns to not search */
  ignorePatterns: string[]
  /** Whether to use created, modified, or published as the default type of date */
  defaultDateType: ValidDateType
  /** Base URL to use for CNAME files, sitemaps, and RSS feeds that require an absolute URL.
   *   Quartz will avoid using this as much as possible and use relative URLs most of the time
   */
  baseUrl?: string
  /**
   * The locale to use for date formatting. Default to "en-US"
   * Allow to translate the date in the language of your choice.
   * Need to be formated following the IETF language tag format (https://en.wikipedia.org/wiki/IETF_language_tag)
   */
  locale?: string
}

export interface QuartzConfig {
  configuration: GlobalConfiguration
  plugins: PluginTypes
}
