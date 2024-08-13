import {LocationDto} from '../screens/home/home-dto';

//Calcula a distancia entre dois pontos utilizando a fórmula de haversine

export const haversineDistance = (
  currentLocation: LocationDto,
  point: LocationDto,
) => {
  const toRad = (x: number) => (x * Math.PI) / 180;

  const lat1 = currentLocation.latitude;
  const lon1 = currentLocation.longitude;
  const lat2 = point.latitude;
  const lon2 = point.longitude;

  const R = 6371e3; // Earth radius in meters
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters

  return distance;
};
