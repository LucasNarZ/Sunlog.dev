
interface AdvantageProps {
    title: string;
    description: string;
}

export function Advantage({ title, description }: AdvantageProps) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </div>
            <div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-white/80 text-sm">{description}</p>
            </div>
        </div>


    )

}
