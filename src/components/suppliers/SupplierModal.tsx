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
  Grid,
  Alert,
} from '@mui/material';
import { CREATE_SUPPLIER, UPDATE_SUPPLIER } from '@/graphql/queries';
import { Supplier, CreateSupplierInput } from '@/types';

interface SupplierModalProps {
  open: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  onSuccess: () => void;
}

export default function SupplierModal({
  open,
  onClose,
  supplier,
  onSuccess,
}: SupplierModalProps) {
  const [createSupplier, { loading: creating, error: createError }] = useMutation(CREATE_SUPPLIER);
  const [updateSupplier, { loading: updating, error: updateError }] = useMutation(UPDATE_SUPPLIER);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateSupplierInput>({
    defaultValues: {
      name: '',
      contact: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name,
        contact: supplier.contact || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
      });
    } else {
      reset({
        name: '',
        contact: '',
        email: '',
        phone: '',
        address: '',
      });
    }
  }, [supplier, reset]);

  const onSubmit = async (data: CreateSupplierInput) => {
    try {
      const input = {
        ...data,
        contact: data.contact || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
      };

      if (supplier) {
        await updateSupplier({
          variables: {
            id: supplier.id,
            input,
          },
        });
      } else {
        await createSupplier({
          variables: { input },
        });
      }

      onSuccess();
    } catch (err) {
      console.error('Error saving supplier:', err);
    }
  };

  const loading = creating || updating;
  const error = createError || updateError;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{supplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Supplier Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="contact"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contact Person"
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                rules={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone"
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    multiline
                    rows={3}
                    fullWidth
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
