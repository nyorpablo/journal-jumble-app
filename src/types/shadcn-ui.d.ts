import * as React from 'react';

// Declare module for shadcn/ui components
declare module '@/components/ui/dropdown-menu' {
  export const DropdownMenu: React.FC<React.PropsWithChildren<any>>;
  export const DropdownMenuTrigger: React.FC<React.PropsWithChildren<any>>;
  export const DropdownMenuContent: React.FC<React.PropsWithChildren<any>>;
  export const DropdownMenuItem: React.FC<React.PropsWithChildren<any>>;
  export const DropdownMenuSeparator: React.FC<React.PropsWithChildren<any>>;
  export const DropdownMenuLabel: React.FC<React.PropsWithChildren<any>>;
  export const DropdownMenuCheckboxItem: React.FC<React.PropsWithChildren<any>>;
  export const DropdownMenuRadioGroup: React.FC<React.PropsWithChildren<any>>;
  export const DropdownMenuRadioItem: React.FC<React.PropsWithChildren<any>>;
}

declare module '@/components/ui/tooltip' {
  export const Tooltip: React.FC<React.PropsWithChildren<any>>;
  export const TooltipTrigger: React.FC<React.PropsWithChildren<any>>;
  export const TooltipContent: React.FC<React.PropsWithChildren<any>>;
  export const TooltipProvider: React.FC<React.PropsWithChildren<any>>;
}

declare module '@/components/ui/select' {
  export const Select: React.FC<React.PropsWithChildren<any>>;
  export const SelectTrigger: React.FC<React.PropsWithChildren<any>>;
  export const SelectContent: React.FC<React.PropsWithChildren<any>>;
  export const SelectItem: React.FC<React.PropsWithChildren<any>>;
  export const SelectValue: React.FC<React.PropsWithChildren<any>>;
}
