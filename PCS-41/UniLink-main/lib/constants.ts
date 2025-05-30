import { Role } from "@prisma/client";

type DashboardRoutesType = {
  [key in Role]: string;
};

export const dashboardRoutes: DashboardRoutesType = {
  SUPER_ADMIN: "/admin/organization-request",
  INSTITUTION_ADMIN: "/institution-admin/verification",
  COMPANY_REPRESENTATIVE: "/company-rep/verification",
  STUDENT: "/student/dashboard",
  GOVERNMENT_REPRESENTATIVE: "/government/dashboard",
  UNVERIFIED: "/auth/profile-setup",
};
