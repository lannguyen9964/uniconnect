import type { CSSProperties } from "react";
import { Smile } from "lucide-react";
import Picker, { EmojiStyle, Theme } from "emoji-picker-react";
import { useThemeStore } from "@/stores/useThemeStore";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface EmojiPickerProps {
    onSelect: (value: string) => void;
}

const pickerTheme = {
    "--epr-bg-color": "hsl(var(--popover))",
    "--epr-category-label-bg-color": "hsl(var(--popover))",
    "--epr-text-color": "hsl(var(--popover-foreground))",
    "--epr-search-input-bg-color": "hsl(var(--muted))",
    "--epr-search-border-color": "hsl(var(--ring))",
    "--epr-picker-border-color": "transparent",
    "--epr-hover-bg-color": "hsl(var(--primary) / 0.1)",
    "--epr-focus-bg-color": "hsl(var(--primary) / 0.15)",
    "--epr-highlight-color": "hsl(var(--primary))",
    "--epr-category-icon-active-color": "hsl(var(--primary))",
    "--epr-emoji-size": "24px",
} as CSSProperties;

const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
    const { isDark } = useThemeStore();

    return (
        <Popover>
            <PopoverTrigger className="cursor-pointer" aria-label="Add emoji">
                <Smile className="size-4" />
            </PopoverTrigger>

            <PopoverContent side="top" align="end" sideOffset={30} className="w-auto border-none bg-transparent p-0 shadow-none drop-shadow-none">
                <Picker
                    theme={isDark ? Theme.DARK : Theme.LIGHT}
                    emojiStyle={EmojiStyle.NATIVE}
                    onEmojiClick={(emoji) => onSelect(emoji.emoji)}
                    style={pickerTheme}
                />
            </PopoverContent>
        </Popover>
    );
};

export default EmojiPicker;
