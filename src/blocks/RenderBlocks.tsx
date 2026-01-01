import { toKebabCase } from '@/utilities/toKebabCase'
import React, { Fragment } from 'react'

import type { Page } from '../payload-types'
import { FeaturesBlock } from './HomePage/Features/Component'
import { CategoryGrid } from './HomePage/CategorySection/Component'
import { ProductGrid } from './HomePage/ProductSection/Component'
import { PromoBanner } from './HomePage/PromoSection/Component'
import { AboutStory } from './AboutPage/AboutStory/Component'
import { AboutValues } from './AboutPage/AboutValues/Component'
import { AboutStats } from './AboutPage/AboutStats/Component'
import { ContactInfoBlock } from './ContactPage/ContactInfo/Component'
import { ContactFAQBlock } from './ContactPage/ContactFAQ/Component'
import { ContactMapBlock } from './ContactPage/ContactMap/Component'
import { ContactFormBlock } from './ContactPage/ContactForm/Component'
import { ContentBlock } from './Content/Component'

const blockComponents = {
  features: FeaturesBlock,
  categoryGrid: CategoryGrid,
  productGrid: ProductGrid,
  promoBanner: PromoBanner,
  aboutStory: AboutStory,
  aboutValues: AboutValues,
  aboutStats: AboutStats,
  contactInfo: ContactInfoBlock,
  contactFAQ: ContactFAQBlock,
  contactMap: ContactMapBlock,
  contactForm: ContactFormBlock,
  content: ContentBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div key={index}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore - weird type mismatch here */}
                  <Block id={toKebabCase(blockName!)} {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
