import { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table';
import { GET_INGREDIENTS, GET_SUPPLIERS } from '@/graphql/queries';
import { Ingredient, Category } from '@/types';
import IngredientModal from '@/components/inventory/IngredientModal';
import StockMovementModal from '@/components/inventory/StockMovementModal';
import { format } from 'date-fns';

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

export default function InventoryPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [categoryFilter, setCategoryFilter] = useState<Category | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredientModalOpen, setIngredientModalOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  const { data, loading, error, refetch } = useQuery<{ ingredients: Ingredient[] }>(
    GET_INGREDIENTS,
    {
      variables: {
        archived: false,
        category: categoryFilter === 'ALL' ? undefined : categoryFilter,
        search: searchQuery || undefined,
      },
    }
  );

  const { data: suppliersData } = useQuery(GET_SUPPLIERS);

  const handleAddNew = () => {
    setSelectedIngredient(null);
    setIngredientModalOpen(true);
  };

  const handleEdit = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setIngredientModalOpen(true);
  };

  const handleStockMovement = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setStockModalOpen(true);
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'SAFE':
        return 'success';
      case 'LOW':
        return 'warning';
      case 'CRITICAL':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns: ColumnDef<Ingredient>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => (
        <Typography variant="body2" fontWeight={500}>
          {info.getValue() as string}
        </Typography>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: (info) => (
        <Chip label={info.getValue() as string} size="small" variant="outlined" />
      ),
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: (info) => {
        const row = info.row.original;
        return (
          <Typography variant="body2">
            {info.getValue() as number} {row.unit}
          </Typography>
        );
      },
    },
    {
      accessorKey: 'stockStatus',
      header: 'Status',
      cell: (info) => (
        <Chip
          label={info.getValue() as string}
          color={getStockStatusColor(info.getValue() as string)}
          size="small"
        />
      ),
    },
    {
      accessorKey: 'costPerUnit',
      header: 'Cost/Unit',
      cell: (info) => `$${(info.getValue() as number).toFixed(2)}`,
    },
    {
      accessorKey: 'totalValue',
      header: 'Total Value',
      cell: (info) => (
        <Typography variant="body2" fontWeight={500}>
          ${(info.getValue() as number).toFixed(2)}
        </Typography>
      ),
    },
    {
      accessorKey: 'supplier',
      header: 'Supplier',
      cell: (info) => {
        const supplier = info.getValue() as any;
        return supplier?.name || '-';
      },
    },
    {
      accessorKey: 'expiryDate',
      header: 'Expiry Date',
      cell: (info) => {
        const date = info.getValue() as string | undefined;
        return date ? format(new Date(date), 'MMM dd, yyyy') : '-';
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <Box display="flex" gap={1}>
          <Button size="small" variant="outlined" onClick={() => handleEdit(info.row.original)}>
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => handleStockMovement(info.row.original)}
          >
            Stock
          </Button>
        </Box>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.ingredients || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

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
        <Typography color="error">Error loading inventory: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Inventory Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your ingredients and stock levels
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNew}>
          Add Ingredient
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          <TextField
            select
            label="Category"
            variant="outlined"
            size="small"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as Category | 'ALL')}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="ALL">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        borderBottom: '2px solid #e0e0e0',
                        fontWeight: 600,
                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted()
                        ? header.column.getIsSorted() === 'desc'
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} style={{ padding: '16px' }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} style={{ padding: '32px', textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No ingredients found
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      </Paper>

      <IngredientModal
        open={ingredientModalOpen}
        onClose={() => {
          setIngredientModalOpen(false);
          setSelectedIngredient(null);
        }}
        ingredient={selectedIngredient}
        suppliers={suppliersData?.suppliers || []}
        onSuccess={() => {
          refetch();
          setIngredientModalOpen(false);
          setSelectedIngredient(null);
        }}
      />

      <StockMovementModal
        open={stockModalOpen}
        onClose={() => {
          setStockModalOpen(false);
          setSelectedIngredient(null);
        }}
        ingredient={selectedIngredient}
        onSuccess={() => {
          refetch();
          setStockModalOpen(false);
          setSelectedIngredient(null);
        }}
      />
    </Box>
  );
}
