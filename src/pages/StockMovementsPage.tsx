import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  SwapVert as SwapVertIcon,
  Inventory as InventoryIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { GET_STOCK_MOVEMENTS, GET_INGREDIENTS } from '@/graphql/queries';
import { StockMovement, MovementType } from '@/types';
import { format, startOfDay, isToday } from 'date-fns';

export default function StockMovementsPage() {
  const [ingredientFilter, setIngredientFilter] = useState<string>('ALL');
  const navigate = useNavigate();

  const { data, loading, error } = useQuery<{ stockMovements: StockMovement[] }>(
    GET_STOCK_MOVEMENTS,
    {
      variables: {
        ingredientId: ingredientFilter === 'ALL' ? undefined : ingredientFilter,
        limit: 100,
      },
    }
  );

  const { data: ingredientsData } = useQuery(GET_INGREDIENTS, {
    variables: { archived: false },
  });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data?.stockMovements) {
      return {
        totalMovements: 0,
        todayMovements: 0,
        inMovements: 0,
        outMovements: 0,
        adjustments: 0,
      };
    }

    const movements = data.stockMovements;
    const todayStart = startOfDay(new Date());

    return {
      totalMovements: movements.length,
      todayMovements: movements.filter(m => 
        new Date(m.createdAt) >= todayStart
      ).length,
      inMovements: movements.filter(m => m.type === 'IN').length,
      outMovements: movements.filter(m => m.type === 'OUT').length,
      adjustments: movements.filter(m => m.type === 'ADJUSTMENT').length,
    };
  }, [data]);

  const getMovementTypeColor = (type: MovementType) => {
    switch (type) {
      case 'IN':
        return 'success';
      case 'OUT':
        return 'error';
      case 'ADJUSTMENT':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatQuantity = (movement: StockMovement) => {
    const prefix = movement.type === 'IN' ? '+' : movement.type === 'OUT' ? '-' : '';
    return `${prefix}${movement.quantity} ${movement.ingredient?.unit || ''}`;
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
        <Typography color="error">Error loading stock movements: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Stock Movements History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete audit trail of all inventory changes - deliveries, usage, and adjustments
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => navigate('/inventory')}
          sx={{
            bgcolor: '#1976d2',
            '&:hover': { bgcolor: '#1565c0' },
            px: 3,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: 3,
          }}
        >
          Record Movement
        </Button>
      </Box>

      {/* Help Alert for First-Time Users */}
      {(!data?.stockMovements || data.stockMovements.length === 0) && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={500} gutterBottom>
            📦 How to Record Stock Movements:
          </Typography>
          <Typography variant="body2">
            1. Click <strong>"Record Movement"</strong> button above or go to <strong>Inventory</strong> page<br/>
            2. Find the ingredient you want to update<br/>
            3. Click the <strong>"Stock"</strong> button on that ingredient<br/>
            4. Choose type: <strong>IN</strong> (received delivery), <strong>OUT</strong> (used in service), or <strong>ADJUSTMENT</strong> (fix count)<br/>
            5. Enter quantity and optional note, then save
          </Typography>
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Movements
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {stats.totalMovements}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    All time
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: '#1976d2',
                    color: 'white',
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <InventoryIcon />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Stock Added (IN)
                  </Typography>
                  <Typography variant="h4" fontWeight={600} color="success.main">
                    {stats.inMovements}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Deliveries received
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: '#2e7d32',
                    color: 'white',
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingUpIcon />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Stock Used (OUT)
                  </Typography>
                  <Typography variant="h4" fontWeight={600} color="error.main">
                    {stats.outMovements}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Consumed in service
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: '#d32f2f',
                    color: 'white',
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingDownIcon />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Adjustments
                  </Typography>
                  <Typography variant="h4" fontWeight={600} color="warning.main">
                    {stats.adjustments}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Manual corrections
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: '#ed6c02',
                    color: 'white',
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SwapVertIcon />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            select
            label="Filter by Ingredient"
            variant="outlined"
            size="small"
            value={ingredientFilter}
            onChange={(e) => setIngredientFilter(e.target.value)}
            sx={{ minWidth: 250 }}
          >
            <MenuItem value="ALL">All Ingredients</MenuItem>
            {ingredientsData?.ingredients.map((ingredient: any) => (
              <MenuItem key={ingredient.id} value={ingredient.id}>
                {ingredient.name}
              </MenuItem>
            ))}
          </TextField>
          <Typography variant="body2" color="text.secondary">
            Showing {data?.stockMovements?.length || 0} movements
          </Typography>
        </Box>
      </Paper>

      {/* Movements Table */}
      <Paper>
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" fontWeight={600}>
            Movement History
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Detailed log of all stock changes with timestamps and reasons
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Date & Time</strong></TableCell>
                <TableCell><strong>Ingredient</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
                <TableCell><strong>Change</strong></TableCell>
                <TableCell><strong>Reason / Note</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.stockMovements && data.stockMovements.length > 0 ? (
                data.stockMovements.map((movement) => (
                  <TableRow 
                    key={movement.id}
                    sx={{
                      '&:hover': { bgcolor: '#f5f5f5' },
                      bgcolor: isToday(new Date(movement.createdAt)) ? '#f0f7ff' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(movement.createdAt), 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(movement.createdAt), 'HH:mm:ss')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {movement.ingredient?.name || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={movement.type === 'IN' ? '📦 Received' : movement.type === 'OUT' ? '📤 Used' : '🔄 Adjusted'}
                        color={getMovementTypeColor(movement.type)}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        fontWeight={600}
                        color={
                          movement.type === 'IN' ? 'success.main' : 
                          movement.type === 'OUT' ? 'error.main' : 
                          'warning.main'
                        }
                      >
                        {formatQuantity(movement)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {movement.note || '—'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box py={8}>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        📋 No stock movements yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stock movements will appear here when you record deliveries, usage, or adjustments
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
