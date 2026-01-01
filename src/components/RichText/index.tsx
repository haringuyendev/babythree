import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  JSXConvertersFunction,
  RichText as RichTextWithoutBlocks,
} from '@payloadcms/richtext-lexical/react'
import { ContentBlock as ContentBlockType } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { ContactInfo as ContactInfoType } from '@/payload-types'
import { ContactInfoBlock } from '@/blocks/ContactPage/ContactInfo/Component'
import { ContactMap as ContactMapType } from '@/payload-types'
import { ContactMapBlock } from '@/blocks/ContactPage/ContactMap/Component'
import { FormBlock as FormBlockType } from '@/payload-types'
import { FormBlock } from '@/blocks/Form/Component'

type NodeTypes =
  | DefaultNodeTypes |SerializedBlockNode<ContentBlockType | ContactInfoType | ContactMapType | FormBlockType>

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    ...defaultConverters.blocks,
    contactInfo: ({ node }) =>  <ContactInfoBlock {...node.fields} />,
    contactMap: ({ node }) =>  <ContactMapBlock {...node.fields} />,
    formBlock: ({ node }) =>  <FormBlock {...node.fields as any} />,
  },
})

type Props = {
  data: SerializedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const RichText: React.FC<Props> = (props) => {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <RichTextWithoutBlocks
      converters={jsxConverters}
      className={cn(
        {
          'container ': enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert ': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
