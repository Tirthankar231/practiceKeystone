import React from "react"
import type { AdminConfig } from '@keystone-6/core/types';
import { CustomNavigation } from '../components/customNavigation';

function CustomLogo() {
  return <h3>ONDC</h3>
}

export const components: AdminConfig['components'] = {
  Navigation: CustomNavigation,
  Logo: CustomLogo
};