import { dataURLToBlob } from "blob-util"

export async function base64ToFile(base64: string, filename: string) {
    const blob = await dataURLToBlob(base64)
    return new File([blob], filename, { type: blob.type })
}