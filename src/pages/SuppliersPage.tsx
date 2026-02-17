import { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { GET_SUPPLIERS } from '@/graphql/queries';
import { Supplier } from '@/types';
import SupplierModal from '@/components/suppliers/SupplierModal';
import { format } from 'date-fns';

export default function SuppliersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const { data, loading, error, refetch } = useQuery<{ suppliers: Supplier[] }>(GET_SUPPLIERS);

  const handleAddNew = () => {
    setSelectedSupplier(null);
    setModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography color="error">Error loading suppliers: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Suppliers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your ingredient suppliers
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNew}>
          Add Supplier
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact Person</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.suppliers && data.suppliers.length > 0 ? (
                data.suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {supplier.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{supplier.contact || '-'}</TableCell>
                    <TableCell>{supplier.email || '-'}</TableCell>
                    <TableCell>{supplier.phone || '-'}</TableCell>
                    <TableCell>{supplier.address || '-'}</TableCell>
                    <TableCell>
                      {format(new Date(supplier.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" onClick={() => handleEdit(supplier)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" py={4}>
                      No suppliers found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <SupplierModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedSupplier(null);
        }}
        supplier={selectedSupplier}
        onSuccess={() => {
          refetch();
          setModalOpen(false);
          setSelectedSupplier(null);
        }}
      />
    </Box>
  );
}
