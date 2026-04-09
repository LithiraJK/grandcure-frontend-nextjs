type Coordinates = {
  latitude: number;
  longitude: number;
};

export function getCurrentCoordinates(): Promise<Coordinates | null> {
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

export async function geocodeAddressCoordinates(address: string): Promise<Coordinates | null> {
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

export async function reverseGeocodeAddress(latitude: number, longitude: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json().catch(() => null)) as
      | {
          display_name?: string;
          address?: {
            city?: string;
            town?: string;
            village?: string;
            municipality?: string;
            county?: string;
            state_district?: string;
            state?: string;
            country?: string;
          };
        }
      | null;

    const cityLike = payload?.address?.city
      ?? payload?.address?.town
      ?? payload?.address?.village
      ?? payload?.address?.municipality;
    const districtLike = payload?.address?.state_district ?? payload?.address?.county;
    const stateLike = payload?.address?.state;
    const countryLike = payload?.address?.country;

    const conciseAddress = [cityLike, districtLike, stateLike, countryLike]
      .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
      .join(", ");

    if (conciseAddress) {
      return conciseAddress;
    }

    if (!payload || typeof payload.display_name !== "string" || !payload.display_name.trim()) {
      return null;
    }

    return payload.display_name;
  } catch {
    return null;
  }
}

export const getCoordinates = async (address: string): Promise<Coordinates | null> => {
  const browserCoordinates = await getCurrentCoordinates();

  if (browserCoordinates) {
    return browserCoordinates;
  }

  return geocodeAddressCoordinates(address);
};
