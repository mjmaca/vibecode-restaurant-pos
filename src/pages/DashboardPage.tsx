import { useQuery } from '@apollo/client';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  EventBusy as EventBusyIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { GET_DASHBOARD_STATS } from '@/graphql/queries';
import { DashboardStats } from '@/types';

export default function DashboardPage() {
  const { data, loading, error } = useQuery<{ dashboardStats: DashboardStats }>(GET_DASHBOARD_STATS);

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
        <Typography color="error">Error loading dashboard: {error.message}</Typography>
      </Box>
    );
  }

  const stats = data?.dashboardStats;

  const statCards = [
    {
      title: 'Total Inventory Value',
      value: `$${stats?.totalInventoryValue.toFixed(2) || 0}`,
      icon: <TrendingUpIcon fontSize="large" />,
      color: '#1976d2',
    },
    {
      title: 'Total Ingredients',
      value: stats?.totalIngredients || 0,
      icon: <InventoryIcon fontSize="large" />,
      color: '#2e7d32',
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockCount || 0,
      icon: <WarningIcon fontSize="large" />,
      color: '#ed6c02',
    },
    {
      title: 'Expiring Soon',
      value: stats?.expiringCount || 0,
      icon: <EventBusyIcon fontSize="large" />,
      color: '#d32f2f',
    },
  ];

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          📊 Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Real-time insights into your restaurant inventory and stock levels
        </Typography>
      </Box>

      {/* Stats Cards with Enhanced Design */}
      <Grid container spacing={3} mb={4}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${card.color}15 0%, ${card.color}05 100%)`,
                border: `1px solid ${card.color}30`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" fontWeight={700} sx={{ color: card.color, mb: 0.5 }}>
                      {card.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {index === 0 && 'Current stock value'}
                      {index === 1 && 'Active items'}
                      {index === 2 && '⚠️ Requires attention'}
                      {index === 3 && '⏰ Check expiry dates'}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: card.color,
                      color: 'white',
                      p: 2,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 12px ${card.color}40`,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Insights Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight={600} display="flex" alignItems="center" gap={1}>
              💰 Inventory Value Breakdown
            </Typography>
            <Box mt={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Total Stock Value
                </Typography>
                <Typography variant="h5" fontWeight={600} color="primary">
                  ${stats?.totalInventoryValue.toFixed(2) || '0.00'}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Items in Stock
                </Typography>
                <Typography variant="h6" fontWeight={500}>
                  {stats?.totalIngredients || 0} items
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Average Value per Item
                </Typography>
                <Typography variant="h6" fontWeight={500}>
                  ${stats?.totalIngredients ? (stats.totalInventoryValue / stats.totalIngredients).toFixed(2) : '0.00'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight={600} display="flex" alignItems="center" gap={1}>
              ⚡ Quick Actions Needed
            </Typography>
            <Box mt={3}>
              {stats?.lowStockCount && stats.lowStockCount > 0 ? (
                <Box 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    bgcolor: '#fff3e0', 
                    borderLeft: '4px solid #ed6c02',
                    borderRadius: 1 
                  }}
                >
                  <Typography variant="body2" fontWeight={600} color="#e65100">
                    🔔 {stats.lowStockCount} item{stats.lowStockCount > 1 ? 's' : ''} running low
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Review inventory page and place orders
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ p: 2, mb: 2, bgcolor: '#e8f5e9', borderLeft: '4px solid #2e7d32', borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight={600} color="#1b5e20">
                    ✅ All stock levels are healthy
                  </Typography>
                </Box>
              )}

              {stats?.expiringCount && stats.expiringCount > 0 ? (
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: '#ffebee', 
                    borderLeft: '4px solid #d32f2f',
                    borderRadius: 1 
                  }}
                >
                  <Typography variant="body2" fontWeight={600} color="#c62828">
                    ⏰ {stats.expiringCount} item{stats.expiringCount > 1 ? 's' : ''} expiring within 7 days
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Use soon to avoid waste
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ p: 2, bgcolor: '#e8f5e9', borderLeft: '4px solid #2e7d32', borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight={600} color="#1b5e20">
                    ✅ No items expiring soon
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
