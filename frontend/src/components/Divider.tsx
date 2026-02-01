interface DividerProps {
    text?: string;
}

export const Divider = ({ text = 'Or' }: DividerProps) => {
    return (
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-500">{text}</span>
            </div>
        </div>
    );
}
