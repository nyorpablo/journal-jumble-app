import * as React from 'react';

// This file provides type definitions for the shadcn/ui components
// that are used in the application. This helps TypeScript understand
// the structure of these components.

declare module '@/components/ui/dropdown-menu' {
  export interface DropdownMenuProps extends React.ComponentPropsWithoutRef<'div'> {
    children?: React.ReactNode;
  }
  export interface DropdownMenuTriggerProps extends React.ComponentPropsWithoutRef<'button'> {
    asChild?: boolean;
    children?: React.ReactNode;
  }
  export interface DropdownMenuContentProps extends React.ComponentPropsWithoutRef<'div'> {
    align?: 'start' | 'end' | 'center';
    sideOffset?: number;
    children?: React.ReactNode;
  }
  export interface DropdownMenuLabelProps extends React.ComponentPropsWithoutRef<'div'> {
    children?: React.ReactNode;
  }
  export interface DropdownMenuSeparatorProps extends React.ComponentPropsWithoutRef<'div'> {}
  export interface DropdownMenuItemProps extends React.ComponentPropsWithoutRef<'div'> {
    children?: React.ReactNode;
  }
  export interface DropdownMenuCheckboxItemProps extends React.ComponentPropsWithoutRef<'div'> {
    children?: React.ReactNode;
  }
  export interface DropdownMenuRadioGroupProps extends React.ComponentPropsWithoutRef<'div'> {
    children?: React.ReactNode;
  }
  export interface DropdownMenuRadioItemProps extends React.ComponentPropsWithoutRef<'div'> {
    children?: React.ReactNode;
  }

  export const DropdownMenu: React.FC<DropdownMenuProps>;
  export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps>;
  export const DropdownMenuContent: React.ForwardRefExoticComponent<
    DropdownMenuContentProps & React.RefAttributes<HTMLDivElement>
  >;
  export const DropdownMenuLabel: React.ForwardRefExoticComponent<
    DropdownMenuLabelProps & React.RefAttributes<HTMLDivElement>
  >;
  export const DropdownMenuSeparator: React.ForwardRefExoticComponent<
    DropdownMenuSeparatorProps & React.RefAttributes<HTMLDivElement>
  >;
  export const DropdownMenuItem: React.ForwardRefExoticComponent<
    DropdownMenuItemProps & React.RefAttributes<HTMLDivElement>
  >;
  export const DropdownMenuCheckboxItem: React.ForwardRefExoticComponent<
    DropdownMenuCheckboxItemProps & React.RefAttributes<HTMLDivElement>
  >;
  export const DropdownMenuRadioGroup: React.ForwardRefExoticComponent<
    DropdownMenuRadioGroupProps & React.RefAttributes<HTMLDivElement>
  >;
  export const DropdownMenuRadioItem: React.ForwardRefExoticComponent<
    DropdownMenuRadioItemProps & React.RefAttributes<HTMLDivElement>
  >;
}

declare module '@/components/ui/tooltip' {
  export interface TooltipProps extends React.ComponentPropsWithoutRef<'div'> {}
  export interface TooltipTriggerProps extends React.ComponentPropsWithoutRef<'button'> {}
  export interface TooltipContentProps extends React.ComponentPropsWithoutRef<'div'> {
    side?: 'top' | 'right' | 'bottom' | 'left';
    sideOffset?: number;
    children?: React.ReactNode;
  }
  export interface TooltipProviderProps extends React.ComponentPropsWithoutRef<'div'> {}

  export const Tooltip: React.FC<TooltipProps>;
  export const TooltipTrigger: React.FC<TooltipTriggerProps>;
  export const TooltipContent: React.ForwardRefExoticComponent<
    TooltipContentProps & React.RefAttributes<HTMLDivElement>
  >;
  export const TooltipProvider: React.FC<TooltipProviderProps>;
}

declare module '@/components/ui/select' {
  export interface SelectProps extends React.ComponentPropsWithoutRef<'div'> {
    onValueChange?: (value: string) => void;
    value?: string;
  }
  export interface SelectTriggerProps extends React.ComponentPropsWithoutRef<'button'> {}
  export interface SelectContentProps extends React.ComponentPropsWithoutRef<'div'> {}
  export interface SelectItemProps extends React.ComponentPropsWithoutRef<'div'> {
    value: string;
  }
  export interface SelectValueProps extends React.ComponentPropsWithoutRef<'span'> {
    placeholder?: string;
  }

  export const Select: React.FC<SelectProps>;
  export const SelectTrigger: React.FC<SelectTriggerProps>;
  export const SelectContent: React.FC<SelectContentProps>;
  export const SelectItem: React.FC<SelectItemProps>;
  export const SelectValue: React.FC<SelectValueProps>;
}
