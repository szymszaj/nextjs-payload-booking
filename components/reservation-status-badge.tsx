import { Badge } from '@/components/ui/badge'

type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

const statusConfig: Record<
  ReservationStatus,
  { label: string; variant: 'default' | 'success' | 'destructive' | 'secondary' | 'warning' | 'outline' }
> = {
  pending: { label: 'Oczekująca', variant: 'warning' },
  confirmed: { label: 'Potwierdzona', variant: 'success' },
  cancelled: { label: 'Anulowana', variant: 'destructive' },
  completed: { label: 'Zakończona', variant: 'secondary' },
}

export function ReservationStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as ReservationStatus] ?? {
    label: status,
    variant: 'outline' as const,
  }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
