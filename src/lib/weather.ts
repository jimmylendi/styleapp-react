export interface LiveWeather {
    tempC: number;
    climate: 'frio' | 'calido';
    isDay: boolean;
}

export const fetchLiveWeather = async (): Promise<LiveWeather> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Tu navegador no soporta geolocalización."));
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                // Round coordinates to 2 decimal places (~1.1km) to preserve city-level accuracy while protecting exact location privacy
                const lat = position.coords.latitude.toFixed(2);
                const lon = position.coords.longitude.toFixed(2);
                const controller = new AbortController();
                const timeoutId = window.setTimeout(() => controller.abort(), 8000);

                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current_weather=true`,
                    { signal: controller.signal }
                );
                window.clearTimeout(timeoutId);
                if (!res.ok) {
                    throw new Error(`El servicio del clima respondió con estado ${res.status}.`);
                }
                const data: unknown = await res.json();

                if (!data || typeof data !== 'object' || !('current_weather' in data)) {
                    throw new Error("No se pudo obtener el clima.");
                }

                const current = (data as { current_weather?: unknown }).current_weather;
                if (!current || typeof current !== 'object') {
                    throw new Error("La respuesta del clima no es válida.");
                }
                const weather = current as Record<string, unknown>;
                const temp = weather.temperature;
                const isDayObj = weather.is_day;
                if (typeof temp !== 'number' || !Number.isFinite(temp) || (isDayObj !== 0 && isDayObj !== 1)) {
                    throw new Error("La respuesta del clima contiene valores inválidos.");
                }

                resolve({
                    tempC: temp,
                    climate: temp < 20 ? 'frio' : 'calido',
                    isDay: isDayObj === 1
                });
            } catch (err) {
                reject(err);
            }
        }, () => {
            reject(new Error("Permiso de ubicación denegado. Se usará el clima por defecto de tu perfil."));
        });
    });
};
