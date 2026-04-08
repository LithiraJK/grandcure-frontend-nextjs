type Coordinates = {
  latitude: number;
  longitude: number;
};

function getBrowserCoordinates(): Promise<Coordinates | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60000,
      },
    );
  });
}

async function getAddressCoordinates(address: string): Promise<Coordinates | null> {
  if (!address.trim()) {
    return null;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const results: Array<{ lat: string; lon: string }> = await response.json();

    if (!results.length) {
      return null;
    }

    const latitude = Number(results[0].lat);
    const longitude = Number(results[0].lon);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return null;
    }

    return { latitude, longitude };
  } catch {
    return null;
  }
}

export const getCoordinates = async (address: string): Promise<Coordinates | null> => {
  const browserCoordinates = await getBrowserCoordinates();

  if (browserCoordinates) {
    return browserCoordinates;
  }

  return getAddressCoordinates(address);
};
