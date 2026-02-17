import { useEffect } from 'react';
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
  Grid,
  Alert,
} from '@mui/material';
import { CREATE_INGREDIENT, UPDATE_INGREDIENT } from '@/graphql/queries';
import { Ingredient, Category, Unit, Supplier, CreateIngredientInput } from '@/types';

interface IngredientModalProps {
  open: boolean;
  onClose: () => void;
  ingredient: Ingredient | null;
  suppliers: Supplier[];
  onSuccess: () => void;
}

const categories: Category[] = [
  'VEGETABLES',
  'FRUITS',
  'MEAT',
  'SEAFOOD',
  'DAIRY',
  'GRAINS',
  'SPICES',
  'BEVERAGES',
  'CONDIMENTS',
  'OTHER',
];

const units: Unit[] = ['KG', 'PCS', 'LITERS', 'GRAMS', 'ML'];

export default function IngredientModal({
  open,
  onClose,
  ingredient,
  suppliers,
  onSuccess,
}: IngredientModalProps) {
  const [createIngredient, { loading: creating, error: createError }] = useMutation(CREATE_INGREDIENT);
  const [updateIngredient, { loading: updating, error: updateError }] = useMutation(UPDATE_INGREDIENT);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateIngredientInput>({
    defaultValues: {
      name: '',
      category: 'OTHER',
      unit: 'KG',
      stock: 0,
      lowStockThreshold: 0,
      costPerUnit: 0,
      supplierId: '',
      expiryDate: '',
    },
  });

  useEffect(() => {
    if (ingredient) {
      reset({
        name: ingredient.name,
        category: ingredient.category,
        unit: ingredient.unit,
        stock: ingredient.stock,
        lowStockThreshold: ingredient.lowStockThreshold,
        costPerUnit: ingredient.costPerUnit,
        supplierId: ingredient.supplierId || '',
        expiryDate: ingredient.expiryDate || '',
      });
    } else {
      reset({
        name: '',
        category: 'OTHER',
        unit: 'KG',
        stock: 0,
        lowStockThreshold: 0,
        costPerUnit: 0,
        supplierId: '',
        expiryDate: '',
      });
    }
  }, [ingredient, reset]);

  const onSubmit = async (data: CreateIngredientInput) => {
    try {
      const input = {
        ...data,
        stock: parseFloat(data.stock as any),
        lowStockThreshold: parseFloat(data.lowStockThreshold as any),
        costPerUnit: parseFloat(data.costPerUnit as any),
        supplierId: data.supplierId || undefined,
        expiryDate: data.expiryDate || undefined,
      };

      if (ingredient) {
        await updateIngredient({
          variables: {
            id: ingredient.id,
            input,
          },
        });
      } else {
        await createIngredient({
          variables: { input },
        });
      }

      onSuccess();
    } catch (err) {
      console.error('Error saving ingredient:', err);
    }
  };

  const loading = creating || updating;
  const error = createError || updateError;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{ingredient ? 'Edit Ingredient' : 'Add New Ingredient'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Category"
                    fullWidth
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="stock"
                control={control}
                rules={{ required: 'Stock is required', min: 0 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Stock"
                    type="number"
                    fullWidth
                    error={!!errors.stock}
                    helperText={errors.stock?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="unit"
                control={control}
                rules={{ required: 'Unit is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Unit"
                    fullWidth
                    error={!!errors.unit}
                    helperText={errors.unit?.message}
                  >
                    {units.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="lowStockThreshold"
                control={control}
                rules={{ required: 'Low stock threshold is required', min: 0 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Low Stock Threshold"
                    type="number"
                    fullWidth
                    error={!!errors.lowStockThreshold}
                    helperText={errors.lowStockThreshold?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="costPerUnit"
                control={control}
                rules={{ required: 'Cost per unit is required', min: 0 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cost Per Unit"
                    type="number"
                    fullWidth
                    error={!!errors.costPerUnit}
                    helperText={errors.costPerUnit?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="supplierId"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Supplier (Optional)" fullWidth>
                    <MenuItem value="">None</MenuItem>
                    {suppliers.map((supplier) => (
                      <MenuItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="expiryDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Expiry Date (Optional)"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
