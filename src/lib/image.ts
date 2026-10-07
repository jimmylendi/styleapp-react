/**
 * Compresses an image file (e.g. from camera/input) and returns a Base64 string.
 * This heavily shrinks the resolution and quality to safely store in localStorage.
 */
export const compressImage = (file: File, maxWidth = 300, quality = 0.6): Promise<string> => {
    return new Promise((resolve, reject) => {
        const MAX_FILE_BYTES = 10 * 1024 * 1024;
        const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
        if (!allowedTypes.has(file.type)) {
            reject(new Error('Formato no permitido. Usa una imagen JPG, PNG o WebP.'));
            return;
        }
        if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
            reject(new Error('La imagen debe pesar menos de 10 MB.'));
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                if (!img.width || !img.height || img.width * img.height > 40_000_000) {
                    reject(new Error('La imagen tiene dimensiones inválidas o demasiado grandes.'));
                    return;
                }
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxWidth) {
                    const scale = Math.min(maxWidth / width, maxWidth / height);
                    width = Math.max(1, Math.round(width * scale));
                    height = Math.max(1, Math.round(height * scale));
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('No se pudo procesar la imagen.'));

                ctx.drawImage(img, 0, 0, width, height);
                // Return highly compressed JPEG
                const base64 = canvas.toDataURL('image/jpeg', quality);
                resolve(base64);
            };
            img.onerror = (e) => reject(e);
        };
        reader.onerror = (e) => reject(e);
    });
};
