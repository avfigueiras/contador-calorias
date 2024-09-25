import { FormT } from "../types/type"

/*El type tiene lo que va a pasar en el reducer, tiene el payload que es lo que gatilla la accion. El type
describe la accion que sucede y el payload tiene la informacion o datos que se agregan al state. En este 
caso es un objeto y del tipo FormT para que no pierda la refrencia. Para poner mas action solo se pone  | y se 
repite {type:'acion-nueva',payload: { newActivity: FormT}}*/
export type ActivityActions =
  { type: 'save-activity', payload: { newActivity: FormT } } |
  { type: 'set-activeId', payload: { id: FormT['id'] } } | //para setear el id solo necesito en el payload ese id por tanto lo declaro asi
  { type: 'delete-activity', payload: { id: FormT['id'] } } |
  { type: 'restart-app' }  // en esta caso como vamos a reiniciar y limpiar la app no necesita payload

export type ActivityState = {
  activities: FormT[],
  activeId: FormT['id'] //se agrega para editar el formulario y poder llenar con los datos del id correspondiente a la actividad
}
//para iniciar nuestro state con lo que tiene el localStorage 
const localStorageActivities = (): FormT[] => {
  //Obtenemos lo que tiene el localStorage
  const activities = localStorage.getItem('activities')
  //si hay actividades retornamos actividades en forma de array y sino un array vacio
  return activities ? JSON.parse(activities) : []
}

export const initialState: ActivityState = {
  activities: localStorageActivities(),
  activeId: ''
}

/*Al reducer le pasamos el state de tipo ActivityState y el valor inicial es un array vacio que es el valor
 de initialState, asi el reducer sabe que tiene las prop del formy el action que es del tipo 
 ActivityAction*/
export const activityReducer = (
  state: ActivityState = initialState,
  action: ActivityActions
) => {
  //para guardar una actividad
  if (action.type === 'save-activity') {
    //aqui la logica que actualiza el state, siempre retornar tenemos una copia del state, para editar veremos primero si tiene un activityId seleccionado
    let updateActivity: FormT[] = []
    if (state.activeId) {
      //busco la que tiene el id, si esta la devuelvo sino para no perder las demas devuelvo la actividad que es el item
      updateActivity = state.activities.map(item => item.id === state.activeId ? action.payload.newActivity : item)
    } else {
      updateActivity = [...state.activities, action.payload.newActivity]
    }

    return {
      ...state,
      activities: updateActivity,
      activeId: ''
    }
  }

  //para el id de la actividad a editar
  if (action.type === 'set-activeId') {
    // como lo que vamos a tomar es el id activo, hago copia del state para que se mantengas los demas y solo tomo el id 
    return {
      ...state,
      activeId: action.payload.id,
    }
  }

  //para eliminar actividad
  if (action.type === 'delete-activity') {
    return {
      ...state,
      activities: state.activities.filter(item => item.id !== action.payload.id)
    }
  }

  //para resetear la app
  if (action.type === 'restart-app') {
    // llevamos todo al valor inicial de vacios
    return {
      activities: [],
      activeId: ''
    }
  }

  //siempre se retorna el state
  return state
}
