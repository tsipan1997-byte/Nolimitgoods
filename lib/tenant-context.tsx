'use client';

// Публічний конфіг партнера для client-компонентів. Значення за замовчуванням — NoLimitGoods,
// тож компонент поза провайдером поводиться як раніше.

import React, { createContext, useContext } from 'react';
import { DEFAULT_TENANT, toPublicTenant, type PublicTenant } from './tenants';

const DEFAULT_PUBLIC = toPublicTenant(DEFAULT_TENANT);
const TenantContext = createContext<PublicTenant>(DEFAULT_PUBLIC);

export function TenantProvider({ tenant, children }: { tenant: PublicTenant; children: React.ReactNode }) {
  return <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>;
}

export function useTenant(): PublicTenant {
  return useContext(TenantContext);
}
