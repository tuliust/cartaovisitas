import { useEffect, useMemo, useState } from 'react'
import Cropper, { type Area, type Point } from 'react-easy-crop'
import { createCroppedAvatar } from '../../lib/imageCrop'

type ImageCropModalProps = {
  image: File | string
  onCancel: () => void
  onConfirm: (file: File) => Promise<void> | void
}

export default function ImageCropModal({ image, onCancel, onConfirm }: ImageCropModalProps) {
  const source = useMemo(() => typeof image === 'string' ? image : URL.createObjectURL(image), [image])
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [pixels, setPixels] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (typeof image === 'string') return
    return () => URL.revokeObjectURL(source)
  }, [image, source])

  async function confirm() {
    if (!pixels) return

    setProcessing(true)
    setError('')

    try {
      const cropped = await createCroppedAvatar(source, pixels)
      await onConfirm(cropped)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível recortar a imagem.',
      )
      setProcessing(false)
    }
  }

  return (
    <div
      className="crop-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !processing) onCancel()
      }}
    >
      <section
        className="crop-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-title"
        aria-describedby="crop-description"
      >
        <header className="crop-modal-header">
          <h2 id="crop-title">Ajustar foto</h2>
          <p id="crop-description">
            Arraste a imagem e use o zoom para enquadrar seu rosto.
          </p>
        </header>

        <div className="crop-stage">
          {source ? (
            <Cropper
              image={source}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_area, areaPixels) => setPixels(areaPixels)}
            />
          ) : null}
        </div>

        <label className="crop-zoom-label" htmlFor="profile-crop-zoom">
          Zoom
          <input
            id="profile-crop-zoom"
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
        </label>

        {error ? <p className="admin-error" role="alert">{error}</p> : null}

        <div className="crop-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
            disabled={processing}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => void confirm()}
            disabled={processing || !pixels}
          >
            {processing ? 'Recortando...' : 'Usar esta foto'}
          </button>
        </div>
      </section>
    </div>
  )
}
