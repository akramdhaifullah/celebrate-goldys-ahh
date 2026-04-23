import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { addMemory } from '../lib/storage.js'

export default function Upload() {
  const [name,    setName]    = useState('')
  const [msg,     setMsg]     = useState('')
  const [note,    setNote]    = useState('')
  const [file,    setFile]    = useState(null)
  const [preview, setPreview] = useState(null) // data URL
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const fileInputRef = useRef(null)

  const onFileChange = e => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(f)
    setErrors(err => ({ ...err, photo: false }))
  }

  const changePhoto = () => {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validate = () => {
    const e = {
      name:    !name.trim(),
      msg:     !msg.trim(),
      photo:   !file,
      note:    !note.trim(),
    }
    setErrors(e)
    return !Object.values(e).some(Boolean)
  }

  const onSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await addMemory({ file, note: note.trim(), name: name.trim(), message: msg.trim() })
      setSent(true)
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err?.message || JSON.stringify(err)}`)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="upload-page">
        <div className="form-wrap">
          <div className="sent-screen show">
            <div className="sent-icon">🎉</div>
            <div className="sent-title">Your memory has been added!</div>
            <div className="sent-sub">Goldan will see your note in the scrapbook.</div>
            <Link className="sent-btn" to="/">Return to Goldan's Scrapbook</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="upload-page">
      <div className="form-wrap">
        <div className="form-header">
          <div className="form-title">Share a Memory</div>
          <div className="form-divider" />
          <div className="form-sub">leave a note for Goldan's twenty-fourth</div>
        </div>

        {/* Name */}
        <div className={`field${errors.name ? ' invalid' : ''}`}>
          <label className="field-label">Your Name</label>
          <input
            className="name-input"
            type="text"
            placeholder="write your name here..."
            value={name}
            onChange={e => { setName(e.target.value); setErrors(err => ({ ...err, name: false })) }}
          />
          <span className="field-err">please write your name</span>
        </div>

        {/* Message */}
        <div className={`field${errors.msg ? ' invalid' : ''}`}>
          <label className="field-label">Your Message</label>
          <div className="message-wrap">
            <textarea
              className="message-area"
              rows="5"
              placeholder="write something kind..."
              value={msg}
              onChange={e => { setMsg(e.target.value); setErrors(err => ({ ...err, msg: false })) }}
            />
          </div>
          <span className="field-err">please write a message for Goldan</span>
        </div>

        {/* Photo */}
        <div className={`field${errors.photo ? ' invalid' : ''}`}>
          <label className="field-label">Attach a Photo</label>

          {!preview ? (
            <div className="upload-zone">
              <span className="upload-icon">📎</span>
              <span className="upload-label">Drop a photo or click to browse</span>
              <span className="upload-hint">JPG, PNG · max 10 MB</span>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={onFileChange}
              />
            </div>
          ) : (
            <div className="preview-wrap show">
              <div className="preview-polaroid">
                <img className="preview-img" src={preview} alt="your photo" />
                <div className={`polaroid-live-note${note.trim() ? '' : ' empty'}`}>
                  {note.trim() || 'your note here...'}
                </div>
              </div>
              <button className="preview-change" onClick={changePhoto}>change photo</button>
            </div>
          )}

          <span className="field-err">please attach a photo</span>
        </div>

        {/* Polaroid note */}
        <div className={`field${errors.note ? ' invalid' : ''}`}>
          <label className="field-label">Add your note</label>
          <input
            className="note-input"
            type="text"
            placeholder="e.g. summer, 2024 · bali trip · best day ever"
            value={note}
            onChange={e => { setNote(e.target.value); setErrors(err => ({ ...err, note: false })) }}
          />
          <span className="field-err">please add a short note for the polaroid</span>
        </div>

        {/* Submit */}
        <button
          className="submit-btn"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? 'Saving…' : "Add to Goldan's Scrapbook"}
        </button>
      </div>
    </div>
  )
}
