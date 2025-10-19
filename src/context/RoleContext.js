import React, { createContext, useState, useEffect } from 'react';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  // Feature flag: show ClosePage role selector (dev only). Set to false to force auth-only routing.
  const [allowRoleSelector, setAllowRoleSelector] = useState(true);

  const fetchUserRole = async () => {
    // Replace with real API call. For now, use a deterministic role for dev to avoid random redirects.
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = typeof window !== 'undefined' ? window.localStorage.getItem('userRole') : null;
        const role = stored || 'Real Estate Agent';
        console.log('RoleContext: Fetched role:', role, 'from localStorage:', stored);
        resolve({ role });
      }, 300);
    });
  };

  useEffect(() => {
    fetchUserRole().then(({ role }) => {
      // Only set the role if we don't already have one set by the user
      if (!userRole) {
        console.log('RoleContext: Setting initial role:', role);
        setUserRole(role);
        try { if (typeof window !== 'undefined') { window.localStorage.setItem('userRole', role); } } catch {}
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const setAndPersistUserRole = (role) => {
    console.log('RoleContext: Setting user role to:', role);
    setUserRole(role);
    try { if (typeof window !== 'undefined') { window.localStorage.setItem('userRole', role); } } catch {}
  };

  return <RoleContext.Provider value={{ userRole, setUserRole: setAndPersistUserRole, allowRoleSelector, setAllowRoleSelector }}>{children}</RoleContext.Provider>;
};


