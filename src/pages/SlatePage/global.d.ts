// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

type CustomElement = {
    type: 'paragraph' | 'code' | 'image' | 'a';
    url?: string;
    children: CustomText[]
}
type CustomText = {
    [key: string]: any;
    text: string;
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}