import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`from { opacity: 0 } to { opacity: 1 }`
const slideUp = keyframes`from { transform: translateY(16px); opacity: 0 } to { transform: translateY(0); opacity: 1 }`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease;
`

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
  animation: ${slideUp} 0.2s ease;
`

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
`

const Subtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 24px;
  line-height: 1.5;
`

const Label = styled.label`
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 8px;
`

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`

const Input = styled.input`
  flex: 1;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  font-family: monospace;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.5;
  }
`

const BtnSave = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, box-shadow 0.15s;

  &:hover:not(:disabled) {
    background: #6d28d9;
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

const Status = styled.div<{ $ok?: boolean; $err?: boolean }>`
  font-size: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${({ $ok, $err }) =>
    $ok ? 'rgba(16,185,129,0.1)' : $err ? 'rgba(239,68,68,0.1)' : 'transparent'};
  color: ${({ $ok, $err }) =>
    $ok ? '#10b981' : $err ? '#ef4444' : 'transparent'};
  border: 1px solid ${({ $ok, $err }) =>
    $ok ? 'rgba(16,185,129,0.3)' : $err ? 'rgba(239,68,68,0.3)' : 'transparent'};
  transition: all 0.2s;
`

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`

const BtnClose = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`

const ConfiguredBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #10b981;
`

const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
  flex-shrink: 0;
`

interface Props {
  onClose: () => void
}

export default function ApiKeyModal({ onClose }: Props) {
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle')
  const [configured, setConfigured] = useState(false)
  const [source, setSource] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/config/gemini-key')
      .then(r => r.json())
      .then(d => {
        setConfigured(d.configured)
        setSource(d.source)
      })
      .catch(() => {})
    inputRef.current?.focus()
  }, [])

  async function handleSave() {
    if (!value.trim()) return
    setSaving(true)
    setStatus('idle')
    try {
      const res = await fetch('/api/config/gemini-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: value.trim() }),
      })
      if (res.ok) {
        setStatus('ok')
        setConfigured(true)
        setSource('file')
        setValue('')
        setTimeout(onClose, 1200)
      } else {
        setStatus('err')
      }
    } catch {
      setStatus('err')
    }
    setSaving(false)
  }

  return (
    <Overlay onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <Modal>
        <Title>Gemini API Key</Title>
        <Subtitle>
          Ingresa tu API key de Google Gemini. Se guarda localmente en <code>config.json</code> — no necesitas configurar variables de entorno.
        </Subtitle>

        {configured && (
          <ConfiguredBadge style={{ marginBottom: 16 }}>
            <Dot />
            Key configurada {source === 'env' ? '(desde variable de entorno)' : '(desde config.json)'}
          </ConfiguredBadge>
        )}

        <Label>Nueva key</Label>
        <InputRow>
          <Input
            ref={inputRef}
            type="password"
            placeholder="AIza..."
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          <BtnSave onClick={handleSave} disabled={saving || !value.trim()}>
            {saving ? '…' : 'Guardar'}
          </BtnSave>
        </InputRow>

        <Status $ok={status === 'ok'} $err={status === 'err'}>
          {status === 'ok' ? '✓ Key guardada correctamente' : status === 'err' ? '✗ Error al guardar la key' : ' '}
        </Status>

        <Footer>
          <BtnClose onClick={onClose}>Cerrar</BtnClose>
        </Footer>
      </Modal>
    </Overlay>
  )
}
