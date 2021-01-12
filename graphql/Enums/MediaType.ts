import { enumType } from 'nexus'

export const MediaType = enumType({
  name: 'MediaType',
  members: ['RawText','Video','Image','Audio','Pdf','Embedd','Markdown'],
})
