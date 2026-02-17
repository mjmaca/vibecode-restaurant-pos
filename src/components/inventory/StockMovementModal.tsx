import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Alert,
  Typography,
  Box,
} from '@mui/material';
import { RECORD_STOCK_MOVEMENT } from '@/graphql/queries';
import { Ingredient, MovementType, RecordStockMovementInput } from '@/types';

interface StockMovementModalProps {
  open: boolean;
  onClose: () => void;
  ingredient: Ingredient | null;
  onSuccess: () => void;
}

const movementTypes: MovementType[] = ['IN', 'OUT', 'ADJUSTMENT'];

export default function StockMovementModal({
  open,
  onClose,
  ingredient,
  onSuccess,
}: StockMovementModalProps) {
  const [recordMovement, { loading, error }] = useMutation(RECORD_STOCK_MOVEMENT);

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<RecordStockMovementInput>({
    defaultValues: {
      ingredientId: '',
      type: 'IN',
      quantity: 0,
      note: '',
    },
  });

  const movementType = watch('type');
  const quantity = watch('quantity');

  const onSubmit = async (data: RecordStockMovementInput) => {
    if (!ingredient) return;

    try {
      await recordMovement({
        variables: {
          input: {
            ...data,
            ingredientId: ingredient.id,
            quantity: parseFloat(data.quantity as any),
          },
        },
      });

      reset();
      onSuccess();
    } catch (err) {
      console.error('Error recording stock movement:', err);
    }
  };

  const calculateNewStock = () => {
    if (!ingredient) return 0;
    const qty = parseFloat(quantity as any) || 0;

    switch (movementType) {
      case 'IN':
        return ingredient.stock + qty;
      case 'OUT':
        return ingredient.stock - qty;
      case 'ADJUSTMENT':
        return qty;
      default:
        return ingredient.stock;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Record Stock Movement</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message}
            </Alert>
          )}

          {ingredient && (
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Ingredient
              </Typography>
              <Typography variant="h6">{ingredient.name}</Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Current Stock: {ingredient.stock} {ingredient.unit}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New Stock: {calculateNewStock().toFixed(2)} {ingredient.unit}
              </Typography>
            </Box>
          )}

          <Controller
            name="type"
            control={control}
            rules={{ required: 'Movement type is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Movement Type"
                fullWidth
                margin="normal"
                error={!!errors.type}
                helperText={errors.type?.message}
              >
                {movementTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="quantity"
            control={control}
            rules={{
              required: 'Quantity is required',
              min: { value: 0.01, message: 'Quantity must be greater than 0' },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Quantity"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.quantity}
                helperText={errors.quantity?.message || `Enter quantity in ${ingredient?.unit || ''}`}
              />
            )}
          />

          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Note (Optional)"
                multiline
                rows={3}
                fullWidth
                margin="normal"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Recording...' : 'Record'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
