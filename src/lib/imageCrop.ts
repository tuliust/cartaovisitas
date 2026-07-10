export type PixelCrop = { x: number; y: number; width: number; height: number }

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Não foi possível carregar a imagem selecionada.'))
    image.src = source
  })
}

export async function createCroppedAvatar(source: string, crop: PixelCrop, size = 800): Promise<File> {
  const image = await loadImage(source)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Não foi possível preparar o recorte da imagem.')

  context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, size, size)
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error('Não foi possível gerar a imagem recortada.')), 'image/jpeg', 0.9)
  })
  return new File([blob], 'avatar-recortado.jpg', { type: 'image/jpeg' })
}
