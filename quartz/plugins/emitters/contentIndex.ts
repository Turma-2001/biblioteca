import { Root } from "hast"
import { GlobalConfiguration } from "../../cfg"
import { getDate } from "../../components/Date"
import { escapeHTML } from "../../util/escape"
import { FilePath, FullSlug, SimpleSlug, joinSegments, simplifySlug } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { toHtml } from "hast-util-to-html"
import path from "path"
import { write } from "./helpers"

export type ContentIndex = Map<FullSlug, ContentDetails>
export type ContentDetails = {
  links: SimpleSlug[]
  content: string
  date?: number
  banner?: string
  description?: string
  subject?: string
  assessement?: number
  type?: string
  deadline?: number
  tableOfContents: any[]
  frontmatter: any
}

interface Options {
  enableSiteMap: boolean
  enableRSS: boolean
  rssLimit?: number
  rssFullHtml: boolean
  includeEmptyFiles: boolean
}

const defaultOptions: Options = {
  enableSiteMap: false, // IGNORED: Not implemented (removed)
  enableRSS: false, // IGNORED: Not implemented (removed)
  rssLimit: 10, // IGNORED: Not implemented (removed)
  rssFullHtml: false, // IGNORED: Not implemented (removed)
  includeEmptyFiles: true,
}

export const ContentIndex: QuartzEmitterPlugin<Partial<Options>> = (opts) => {
  opts = { ...defaultOptions, ...opts }
  return {
    name: "ContentIndex",
    async emit(ctx, content, _resources) {
      const emitted: FilePath[] = []
      const linkIndex: ContentIndex = new Map()

      for (const [tree, file] of content) {
        const slug = file.data.slug!
        const data = file.data
        let date = data.frontmatter?.date

        if (!date) {
          let localDate = getDate(ctx.cfg.configuration, data)

          if (localDate)
            date = localDate.getTime() / 1000
        }

        if (opts?.includeEmptyFiles || (file.data.text && file.data.text !== "")) {
          linkIndex.set(slug, {
            frontmatter: data.frontmatter,
            date: date,

            content: escapeHTML(toHtml(tree as Root, { allowDangerousHtml: true, allowDangerousCharacters: true })) ?? "",

            links: file.data.links ?? [],
            tableOfContents: file.data.toc ?? []
          })
        }
      }

      const fp = joinSegments("static", "contentIndex") as FullSlug
      const simplifiedIndex = Object.fromEntries(Array.from(linkIndex))

      emitted.push(
        await write({
          ctx,
          content: JSON.stringify(simplifiedIndex),
          slug: fp,
          ext: ".json",
        }),
      )

      return emitted
    },
    getQuartzComponents: () => [],
  }
}
