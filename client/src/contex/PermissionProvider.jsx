/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ReactNode,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

import { TAllPermission } from "../types/permission.types";

interface PermissionContextValue {
  loggedInUserPermissions: string[];
  setLoggedInUserPermissions: Dispatch<SetStateAction<string[]>>;
  handleCheckPermissions: (item: TAllPermission) => boolean;
}

const defaultPermissionContextValue: PermissionContextValue = {
  loggedInUserPermissions: [],
  setLoggedInUserPermissions: () => [],
  handleCheckPermissions: (_item: TAllPermission) => true || false,
};

export const PermissionContextProvider = createContext<PermissionContextValue>(
  defaultPermissionContextValue
);

const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const [loggedInUserPermissions, setLoggedInUserPermissions] = useState<
    string[]
  >([]);
  const s = true;
  const handleCheckPermissions = (item: TAllPermission) => {
    if (s) {
      // console.log({ loggedInUserPermissions, from: "prvider" });
      const checkInLoggedInUserPermissions = loggedInUserPermissions.find(
        (per) => per == item
      );

      if (checkInLoggedInUserPermissions) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const value = {
    loggedInUserPermissions,
    setLoggedInUserPermissions,
    handleCheckPermissions: handleCheckPermissions,
  };
  return (
    <PermissionContextProvider.Provider value={value}>
      {children}
    </PermissionContextProvider.Provider>
  );
};

export default PermissionProvider;
