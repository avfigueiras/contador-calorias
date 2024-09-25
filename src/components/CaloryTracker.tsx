import { useMemo } from "react"
import { FormT } from "../types/type"
import { CustomCalorieDisplay } from "./CustomCalorieDisplay"

type CaloryTrackerProps = {
    activities: FormT[]
}

export const CaloryTracker = ({ activities }: CaloryTrackerProps) => {
    // calorias consumidas
    const caloriesConsummed = useMemo(() => activities.reduce((total: number, currentActivity: FormT) => currentActivity.category === 1 ? total + currentActivity.calories : total, 0), [activities])

    //calorias quemadas
    const caloriesBurned = useMemo(() => activities.reduce((total: number, currentActivity: FormT) => currentActivity.category === 2 ? total + currentActivity.calories : total, 0), [activities])

    //calorias resultado de la resta de las ingeridas - las quemadas
    const netCalories = useMemo(() => caloriesConsummed - caloriesBurned, [activities])


    return (
        <div>
            <p className="text-white text-center font-black text-4xl">Resumen de Calorias</p>
            <div className="flex flex-col items-center md:flex-row md:justify-between gap-5 mt-10">
                <CustomCalorieDisplay totals={caloriesConsummed} text='Consumidas' />
                <CustomCalorieDisplay totals={caloriesBurned} text='Quemadas' />
                <CustomCalorieDisplay totals={netCalories} text='Diferencia' />
            </div>
        </div>
    )
}
