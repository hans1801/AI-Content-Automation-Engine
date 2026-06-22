import { useState, useRef } from 'react'

export default function Uploader({ ideaId, onUploaded }) {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  function addFiles(incoming) {
    const mp4s = Array.from(incoming).filter((f) => f.name.toLowerCase().endsWith('.mp4'))
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name))
      return [...prev, ...mp4s.filter((f) => !names.has(f.name))]
    })
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  function removeFile(name) {
    setFiles((prev) => prev.filter((f) => f.name !== name))
  }

  async function handleUpload() {
    if (!files.length) return
    setUploading(true)
    const sorted = [...files].sort((a, b) => a.name.localeCompare(b.name))
    const form = new FormData()
    sorted.forEach((f) => form.append('files', f))
    await fetch(`/api/ideas/${ideaId}/videos`, { method: 'POST', body: form })
    setFiles([])
    setUploading(false)
    onUploaded()
  }

  const sorted = [...files].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="uploader">
      <div
        className={`drop-zone ${dragging ? 'dragging' : ''} ${files.length ? 'has-files' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !files.length && inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".mp4,video/mp4"
          style={{ display: 'none' }}
          onChange={(e) => addFiles(e.target.files)}
        />

        {files.length === 0 ? (
          <div className="drop-hint">
            <div className="drop-icon">🎬</div>
            <p>Arrastra los videos o haz clic para seleccionar</p>
            <small>Solo .mp4 — se ordenarán por nombre de archivo</small>
          </div>
        ) : (
          <div className="file-list" onClick={(e) => e.stopPropagation()}>
            {sorted.map((f, i) => (
              <div key={f.name} className="file-item">
                <span className="scene-num">Escena {i + 1}</span>
                <span className="file-name">{f.name}</span>
                <span className="file-size">{(f.size / 1e6).toFixed(1)} MB</span>
                <button className="remove-btn" onClick={() => removeFile(f.name)}>×</button>
              </div>
            ))}
            <button
              className="add-more-btn"
              onClick={() => inputRef.current.click()}
            >
              + Agregar más
            </button>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <button className="btn-primary" onClick={handleUpload} disabled={uploading}>
          {uploading
            ? 'Subiendo...'
            : `Subir ${files.length} video${files.length !== 1 ? 's' : ''}`}
        </button>
      )}
    </div>
  )
}
