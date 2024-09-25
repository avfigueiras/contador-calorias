import { ChangeEvent, Dispatch, FormEvent, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { categories } from '../data/categories'
import { FormT } from '../types/type'
import { ActivityActions, ActivityState } from '../reducers/activity-reducer'

type FormProps = {
    dispatch: Dispatch<ActivityActions>
    state: ActivityState
}

const initialState: FormT = {
    id: uuidv4(),
    category: 1, 
    activity:'',
    calories:0
 }

export const Form = ({dispatch, state} : FormProps) => {
 const [formState, setFormState] = useState<FormT>(initialState)

 useEffect(() => {
    if(state.activeId){
        //para que nos retorne un objeto al final del filter le ponemos [0]
       const selected = state.activities.filter( item => item.id === state.activeId)[0]
      setFormState(selected)
    }
 }, [state.activeId])

 /*sixtaxis hook useReducer(reducer(funcion que toma el estado actual y una accion y devuelve un nuevo estado), initialState(estado
 inicial del reducer) ahora del lado izquierdo esta el state(es el valor del estado cuya logica se maneja dentro 
 del reducer) y dispatch(funcion que manda a llamar la accion con el payload ), action(son las funciones que manejan la 
 logica para modificar el state), payload(es la informacion que modifica el state) ). Cada reducer tiene su propio state
 y se veria asi  const [state, dispatch] = useReducer(reducer, initialState)
 */


 /*Como el state es un objeto vamos a escribir en el state usando una unica funcion, para escribir sin perder la 
 referencia de los campo que se van llenando, se copia el state y se asigna como key entre [el id del evento] y
 como valor el value*/
 const handleChange = (e:ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
    //para comprobar antes de setear el valor al state que categoria y calorias son numeros
    const isNumberField = ['category', 'calories'].includes(e.target.id) // me retorna true si escribo en esos campos
    setFormState({
        ... formState,
        [e.target.id]:isNumberField ? +e.target.value : e.target.value // si es true me lo convierte a numero sino el valor
    })
 }

 const isValid = () => {
    //validamos que los campos actividad y calorias no esten vacios. El .trim() quita los espacios al inicio y al final
    const {activity, calories} = formState
    return activity.trim() !== '' && calories > 0
 }

 const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
    //para prevenir la accion por default
    e.preventDefault()
    /*para manejar el estado como este proyecto es mas complejo vamos  usar el hook useReducer(es un alternativa de useStat, 
    que permite add un reducer a tu componente, es la base para Zustand. Se usa para  manejar estados mas complejos y
    transiciones que involucran logica mas compleja, donde el nuevo estado depende del estado anterior o cuando hay multiples
    sub-valores  o logica condicional a considerar)*/
    /*usamos el dispatch que nos llama la accion definida en el reducer, como es un objeto asi lo pasamos.
    el payload en el newActivity le asignamos el formState que tiene los valores del formulario*/
    dispatch({type: 'save-activity', payload: {newActivity: formState}})
    setFormState({...initialState, id: uuidv4()})
 }

    return (
        <form
            className=" space-y-5 bg-white shadow p-10 rounded-lg"
            onSubmit={ handleSubmit}
        >
            <div className=" grid grid-cols-1 gap-3">
                <label htmlFor="category"> Categoría:</label>
                <select
                    className=" border border-slate-300 p-2 rounded-lg w-full bg-white"
                    id="category"
                    value={formState.category}
                    onChange={e => handleChange(e)}
                >
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className=" grid grid-cols-1 gap-3">
                <label htmlFor="activity" className=' font-bold'> Actividad:</label>
                <input
                    id="activity"
                    type="text"
                    className='border border-slate-300 p-2 rounded-lg'
                    placeholder='Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas, Bicicleta'
                    value={formState.activity}
                    onChange={e => handleChange(e)}
                />
            </div>
            <div className=" grid grid-cols-1 gap-3">
                <label htmlFor="calories" className=' font-bold'> Calorias:</label>
                <input
                    id="calories"
                    type="number"
                    className='border border-slate-300 p-2 rounded-lg'
                    placeholder='Calorias ej. 300 o 500'
                    value={formState.calories}
                    onChange={e => handleChange(e)}
                />
            </div>
            <input
                    type="submit"
                    className='bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10'
                    value={formState.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}
                    disabled={!isValid()}
                />
        </form>
    )
}
