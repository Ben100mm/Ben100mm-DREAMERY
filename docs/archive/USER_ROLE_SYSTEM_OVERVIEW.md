# Dreamery User Role System - Overview

**Last Updated:** December 2024  
**Status:** Implemented

---

## What Changed

**Before:** Simple toggle between "Buyer" and "Agent"  
**After:** Comprehensive dropdown with 6 distinct user roles, each with their own dashboard and features

---

## User Role Types

### 1. **Buyer**
- **Description:** Individual homebuyers
- **Sidebar:** Visible (320px) - Closing features navigation
- **Dashboard:** Standard closing features
- **Features:** Offers, agreements, notifications, search
- **Use Case:** People buying homes directly

### 2. **Buying Agent**
- **Description:** Agents representing buyers (same view as buyer)
- **Sidebar:** Visible (320px) - Closing features navigation
- **Dashboard:** Same as buyer dashboard (not agent dashboard)
- **Features:** Offers, agreements, notifications, search, transactions, documents
- **Use Case:** Agents working with buyers (see buyer perspective)

### 3. **Listing Agent**
- **Description:** Agents representing sellers
- **Sidebar:** Hidden (full-width view)
- **Dashboard:** Agent dashboard with listing tools
- **Features:** Listings, offers, documents, commission
- **Use Case:** Agents working with sellers (see agent dashboard)

### 4. **Broker**
- **Description:** Office-level oversight
- **Sidebar:** Hidden (full-width view)
- **Dashboard:** Broker dashboard
- **Features:** Compliance, reports, agent management, financials
- **Use Case:** Office managers and brokers

### 5. **Brand Manager**
- **Description:** Multi-office brand oversight
- **Sidebar:** Hidden (full-width view)
- **Dashboard:** Enterprise dashboard
- **Features:** Multi-office, branding, recruiting, analytics
- **Use Case:** Brand-level managers

### 6. **Enterprise**
- **Description:** Large brokerage with multiple brands
- **Sidebar:** Hidden (full-width view)
- **Dashboard:** Enterprise dashboard
- **Features:** Enterprise tools, marketplace, integrations, AI insights
- **Use Case:** Large brokerage executives

---

## UI Implementation

### **Header Dropdown**
- **Location:** Top-right of AppBar
- **Style:** White text on primary background
- **Features:** 
  - Role icon
  - Role label
  - Role description
  - Hover effects

### **Dynamic Sidebar**
- **Buyer/Buying Agent Views:** 320px sidebar with closing features navigation
- **Listing Agent Views:** Full-width dashboard (no sidebar, agent dashboard)
- **Broker/Enterprise Views:** Full-width dashboard (no sidebar, enterprise dashboards)
- **Smooth Transitions:** CSS transitions for width changes

### **Role-Specific Headers**
- **Current Role Display:** Shows "Buyer View", "Agent View", etc.
- **Dashboard Titles:** Role-specific dashboard headers
- **Feature Sets:** Different features based on role

---

## Technical Implementation

### **State Management**
```typescript
const [selectedUserRole, setSelectedUserRole] = useState<UserRoleType>('buyer');
```

### **Role Configuration**
```typescript
interface UserRoleConfig {
  id: UserRoleType;
  label: string;
  description: string;
  icon: string;
  hasSidebar: boolean;
  hasAgentDashboard: boolean;
  hasBrokerDashboard: boolean;
  hasEnterpriseDashboard: boolean;
  features: string[];
}
```

### **Computed Properties**
```typescript
const currentUserRole = userRoleConfigs.find(role => role.id === selectedUserRole);
const isBuyerView = selectedUserRole === 'buyer' || selectedUserRole === 'buying-agent'; // Both see buyer view
const isAgentView = selectedUserRole === 'listing-agent'; // Only listing agents see agent dashboard
const isBrokerView = selectedUserRole === 'broker';
const isEnterpriseView = selectedUserRole === 'brand-manager' || selectedUserRole === 'enterprise';
```

---

## Responsive Behavior

### **Mobile**
- Drawer becomes temporary overlay
- Full-width content on small screens
- Touch-friendly dropdown

### **Desktop**
- Permanent sidebar for buyer/agent views
- Full-width dashboard for broker/enterprise views
- Smooth transitions between states

---

## Benefits of New System

### **1. Scalability**
- Easy to add new user roles
- Role-specific feature sets
- Flexible dashboard layouts

### **2. User Experience**
- Clear role identification
- Appropriate feature access
- Consistent navigation patterns

### **3. Development**
- Centralized role configuration
- Reusable dashboard components
- Easy to maintain and extend

---

## Future Enhancements

### **Role-Based Permissions**
- Feature access control
- Data visibility rules
- Action permissions

### **Custom Dashboards**
- Role-specific widgets
- Personalized layouts
- Customizable features

### **Multi-Role Support**
- Users with multiple roles
- Role switching within session
- Role inheritance

---

## Implementation Checklist

- **User Role Configuration** - All 6 roles defined
- **Dropdown Component** - Material-UI Select with icons
- **Dynamic Sidebar** - Shows/hides based on role
- **Role-Specific Dashboards** - Different content for each role
- **Responsive Design** - Mobile and desktop support
- **Smooth Transitions** - CSS animations for state changes
- **Role Indicators** - Clear visual feedback

---

## Next Steps

1. **Complete Broker Dashboard** - Add compliance tools and reports
2. **Enterprise Features** - Multi-office management tools
3. **Role Permissions** - Feature access control
4. **Custom Dashboards** - Role-specific widgets and layouts
5. **User Management** - Role assignment and management

---

*This system provides a solid foundation for scaling Dreamery to support all user types from individual buyers to enterprise brokerages.*
