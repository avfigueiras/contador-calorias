type CustomCalorieDisplayProps = {
    totals: number,
    text: string
}

export const CustomCalorieDisplay = ({ totals, text }: CustomCalorieDisplayProps) => {
    return (
        <p className="text-white text-center font-bold rounded-full grid grid-cols-1 gap-3">
            <span className="text-6xl font-black text-orange">{totals}</span>
            {text}
        </p>
    )
}
