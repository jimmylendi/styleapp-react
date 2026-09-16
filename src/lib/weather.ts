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
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Open-Meteo is completely free for non-commercial use and requires no API KEY!
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
                const data = await res.json();

                if (!data.current_weather) {
                    throw new Error("No se pudo obtener el clima.");
                }

                const temp = data.current_weather.temperature;
                const isDayObj = data.current_weather.is_day; // 1 or 0

                resolve({
                    tempC: temp,
                    climate: temp < 20 ? 'frio' : 'calido',
                    isDay: isDayObj === 1
                });
            } catch (err) {
                reject(err);
            }
        }, (_error) => {
            reject(new Error("Permiso de ubicación denegado. Se usará el clima por defecto de tu perfil."));
        });
    });
};
