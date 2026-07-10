import { useEffect, useMemo, useState } from 'react'
import Cropper, { type Area, type Point } from 'react-easy-crop'
import { createCroppedAvatar } from '../../lib/imageCrop'

type ImageCropModalProps = {
  file: File
  onCancel: () => void
  onConfirm: (file: File) => Promise<void> | void
}

export default function ImageCropModal({ file, onCancel, onConfirm }: ImageCropModalProps) {
  const source = useMemo(() => URL.createObjectURL(file), [file])
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [pixels, setPixels] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => URL.revokeObjectURL(source)
  }, [source])

  async function confirm() {
    if (!pixels) return
    setProcessing(true)
    setError('')
    try {
      const cropped = await createCroppedAvatar(source, pixels)
      await onConfirm(cropped)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível recortar a imagem.')
      setProcessing(false)
    }
  }

  return <div className="crop-modal-backdrop" role="presentation">
    <section className="crop-modal" role="dialog" aria-modal="true" aria-labelledby="crop-title">
      <div><h2 id="crop-title">Ajustar foto</h2><p>Arraste a imagem e use o zoom para enquadrar seu rosto.</p></div>
      <div className="crop-stage">
        {source ? <Cropper image={source} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={false} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_area, areaPixels) => setPixels(areaPixels)} /> : null}
      </div>
      <label className="crop-zoom-label">Zoom<input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /></label>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="crop-actions"><button type="button" className="secondary-button" onClick={onCancel} disabled={processing}>Cancelar</button><button type="button" className="primary-button" onClick={() => void confirm()} disabled={processing || !pixels}>{processing ? 'Recortando...' : 'Usar esta foto'}</button></div>
    </section>
  </div>
}
