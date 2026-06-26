import { useState } from 'react'
import { ScriptFormData, DEFAULT_FORM } from '../../tools/types'
import { Form, Field, Label, TextArea, TextInput, Row, Select, SubmitBtn } from './ScriptForm.styled'

const STYLES = [
  { value: 'stickman', label: 'Stickman / Sketch' },
  { value: 'realistic', label: 'Realista / Cinematográfico' },
  { value: 'anime', label: 'Anime / Manga' },
  { value: 'watercolor', label: 'Acuarela / Artístico' },
  { value: 'flat', label: 'Flat / Minimalista' },
]

const CATEGORIES = [
  { value: 'finanzas', label: 'Finanzas' },
  { value: 'horror', label: 'Horror / Thriller' },
  { value: 'motivacion', label: 'Motivación' },
  { value: 'historia', label: 'Historia / Documental' },
  { value: 'ciencia', label: 'Ciencia / Tech' },
]

const TONES = [
  { value: 'motivacional', label: 'Motivacional' },
  { value: 'educativo', label: 'Educativo' },
  { value: 'dramatico', label: 'Dramático' },
  { value: 'entretenimiento', label: 'Entretenimiento' },
  { value: 'inspiracional', label: 'Inspiracional' },
]

const ASPECT_RATIOS = [
  { value: '9:16', label: '9:16 — Vertical (Shorts)', disabled: false },
  { value: '16:9', label: '16:9 — Horizontal (coming soon)', disabled: true },
]

const CUSTOM = '__custom__'

function isCustom(options: { value: string }[], value: string) {
  return !options.some(o => o.value === value)
}

// Standalone component so React keeps a stable identity across renders
interface SelectFieldProps {
  fieldLabel: string
  options: { value: string; label: string; disabled?: boolean }[]
  isCustomMode: boolean
  currentValue: string
  onSelect: (value: string) => void
  onCustomChange: (value: string) => void
  showCustom?: boolean
}

function SelectField({
  fieldLabel,
  options,
  isCustomMode,
  currentValue,
  onSelect,
  onCustomChange,
  showCustom = true,
}: SelectFieldProps) {
  return (
    <Field>
      <Label>{fieldLabel}</Label>
      <Select
        value={isCustomMode ? CUSTOM : currentValue}
        onChange={e => onSelect(e.target.value)}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
        ))}
        {showCustom && <option value={CUSTOM}>Personalizado...</option>}
      </Select>
      {isCustomMode && (
        <TextInput
          placeholder={`Escribe tu propio ${fieldLabel.toLowerCase()}...`}
          value={currentValue}
          onChange={e => onCustomChange(e.target.value)}
          autoFocus
        />
      )}
    </Field>
  )
}

interface ScriptFormProps {
  initial?: ScriptFormData
  onSubmit: (data: ScriptFormData) => void
}

// Derived from ScriptFormData so CustomKey is always a strict subset of its keys
type CustomKey = Exclude<keyof ScriptFormData, 'idea'>
type CustomFields = Record<CustomKey, boolean>

export default function ScriptForm({ initial, onSubmit }: ScriptFormProps) {
  const init = initial ?? DEFAULT_FORM
  const [data, setData] = useState<ScriptFormData>(init)
  const [custom, setCustom] = useState<CustomFields>({
    style: isCustom(STYLES, init.style),
    category: isCustom(CATEGORIES, init.category),
    tone: isCustom(TONES, init.tone),
    aspect_ratio: isCustom(ASPECT_RATIOS, init.aspect_ratio),
  })

  function set<K extends keyof ScriptFormData>(key: K, value: string) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  function handleSelect(field: keyof CustomFields, value: string) {
    if (value === CUSTOM) {
      setCustom(prev => ({ ...prev, [field]: true }))
      set(field, '')
    } else {
      setCustom(prev => ({ ...prev, [field]: false }))
      set(field, value)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!data.idea.trim()) return
    onSubmit(data)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Field>
        <Label>Idea / Tema *</Label>
        <TextArea
          placeholder="Ej: La regla del 50/30/20 para ahorrar dinero y alcanzar libertad financiera..."
          value={data.idea}
          onChange={e => set('idea', e.target.value)}
        />
      </Field>

      <Row>
        <SelectField
          fieldLabel="Estilo Visual"
          options={STYLES}
          isCustomMode={custom.style}
          currentValue={data.style}
          onSelect={v => handleSelect('style', v)}
          onCustomChange={v => set('style', v)}
        />
        <SelectField
          fieldLabel="Categoría"
          options={CATEGORIES}
          isCustomMode={custom.category}
          currentValue={data.category}
          onSelect={v => handleSelect('category', v)}
          onCustomChange={v => set('category', v)}
        />
      </Row>

      <Row>
        <SelectField
          fieldLabel="Tono"
          options={TONES}
          isCustomMode={custom.tone}
          currentValue={data.tone}
          onSelect={v => handleSelect('tone', v)}
          onCustomChange={v => set('tone', v)}
        />
        <SelectField
          fieldLabel="Aspect Ratio"
          options={ASPECT_RATIOS}
          isCustomMode={custom.aspect_ratio}
          currentValue={data.aspect_ratio}
          onSelect={v => handleSelect('aspect_ratio', v)}
          onCustomChange={v => set('aspect_ratio', v)}
          showCustom={false}
        />
      </Row>

      <SubmitBtn type="submit" disabled={!data.idea.trim()}>
        Generar Script
      </SubmitBtn>
    </Form>
  )
}
