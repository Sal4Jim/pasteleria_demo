import { createContext, useContext, useState, ReactNode } from "react";

type Role = "admin" | "vendor";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType>({ role: "admin", setRole: () => {} });

export const useRole = () => useContext(RoleContext);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("admin");
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}
