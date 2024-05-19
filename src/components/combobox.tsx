"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMemo } from "react";

type ComboboxProps = React.ComponentProps<typeof CommandInput> & {
  options: { value: string; label: string; icon?: React.ReactNode }[];
  emptyText?: string;
  selectText?: string;
  onChange: (value: string | undefined) => void;
};

export function Combobox({
  options,
  emptyText,
  selectText,
  onChange,
  value: _,
  ...props
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const _emptyText = emptyText ?? "No options found.";
  const _selectText = selectText ?? "Select an option...";

  const currentLabel = useMemo(() => {
    const found = options.find((framework) => framework.value === value);
    if (!found) return _selectText;

    return (
      <div className="flex items-center gap-2">
        {found.icon} {found.label}
      </div>
    );
  }, [value, options, _selectText]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-transparent"
        >
          {currentLabel}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput className="h-9" {...props} />
          <CommandEmpty>{_emptyText}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label}
                onSelect={() => {
                  const isRemoving = option.value === value;
                  setValue(isRemoving ? "" : option.value);
                  onChange(isRemoving ? undefined : option.value);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  {option.icon} {option.label}
                </div>
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandList />
        </Command>
      </PopoverContent>
    </Popover>
  );
}
