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

export interface Idea {
  id: number
  title: string
  category: string
  state: string
  form?: ScriptFormData
}
