import React from 'react'
import { Box, Drawer, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Typography, Avatar } from '@mui/material'
import { Menu as MenuIcon, Dashboard as DashboardIcon, Settings as SettingsIcon, People as PeopleIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const drawerWidth = 240

type Props = {
  open: boolean
  onDrawerToggle: () => void
  children?: React.ReactNode
}

export default function DashboardLayout({ open, onDrawerToggle, children }: Props) {
  const menuItems = [
    { text: 'Dashboard', to: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Users', to: '/entities', icon: <PeopleIcon /> },
    { text: 'Settings', to: '#', icon: <SettingsIcon /> },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={(theme) => ({
          width: open ? drawerWidth : 64,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 64,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          },
        })}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
          <IconButton onClick={onDrawerToggle} sx={{ color: 'inherit' }} aria-label="toggle drawer">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1, display: (theme) => (open ? 'block' : 'none') }}>
            RackMaster
          </Typography>
        </Box>
        <Toolbar />
        <Divider />

        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.to} sx={{ color: 'inherit' }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0, color: 'inherit' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ pb: 2 }}>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton sx={{ color: 'inherit' }} onClick={() => console.log('Profile')}>
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                  <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.contrastText', color: 'primary.main' }}>
                    <AccountCircleIcon fontSize="small" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="My Profile" sx={{ opacity: open ? 1 : 0, color: 'inherit' }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}
