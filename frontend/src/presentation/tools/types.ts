export interface ScriptFormData {
  idea: string
  style: string
  category: string
  tone: string
  aspect_ratio: string
}

export const DEFAULT_FORM: ScriptFormData = {
  idea: '',
  style: 'stickman',
  category: 'finanzas',
  tone: 'motivacional',
  aspect_ratio: '9:16',
}

export type IdeaState =
  | 'NEW'
  | 'SCRIPT_GENERATED'
  | 'IMAGES_GENERATED'
  | 'VIDEOS_GENERATED'
  | 'AUDIO_GENERATED'
  | 'VIDEO_GENERATED'
  | 'VIDEO_SUBTITLED'
  | 'VIDEO_MUSIC_GENERATED'
  | 'COMPLETED'

export type PipelineLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type MusicNode =
  | { type: 'file'; name: string; path: string; size: number }
  | { type: 'dir';  name: string; path: string; children: MusicNode[] }

export interface Idea {
  id: number
  title: string
  category: string
  state: IdeaState
  form?: ScriptFormData
}
