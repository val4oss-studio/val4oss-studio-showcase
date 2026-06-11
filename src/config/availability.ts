export type AvailabilityStatus = 'available' | 'busy' | 'none';
export const CURRENT_AVAILABILITY: AvailabilityStatus = 'available';

export const AVAILABILITY_PULSE: Record<AvailabilityStatus, 'success' | 'warning' | 'error'> = {
  available: 'success',
  busy:      'warning',
  none:      'error',
};
