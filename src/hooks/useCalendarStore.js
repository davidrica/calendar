import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvent, onSetActiveEvent, onUpdateEvent } from "../store/calendar/calendarSlice"
import { calendarApi } from "../api"
import { convertEventsToDateEvents } from "../helpers"
import Swal from "sweetalert2"


export const useCalendarStore = ()=>{
    const dispatch = useDispatch()
    
    const { events,activeEvent } = useSelector(state =>state.calendar)
    const { user } = useSelector(state=>state.auth)

    const setActiveEvent=(calendarEvent)=>{
        dispatch(onSetActiveEvent(calendarEvent))
    }

    const startSavingEvent = async(calendarEvent)=>{

        try {
            if(calendarEvent.id){

                const {data} = await calendarApi.put(`/events/${calendarEvent.id}`,calendarEvent);
                 
                dispatch(onUpdateEvent({...calendarEvent,user}))
                return
            }
            const {data} = await calendarApi.post('/events',calendarEvent)
          
            dispatch(onAddNewEvent({...calendarEvent,id: data.evento.id ,user}))
            
                
        } catch (error) {
        
           Swal.fire('Error en actualizacion',error.response.data.msg,'error')
        }
    }

    const startDeletingEvent= async() => {
        try {
            if(activeEvent.id){

                const {data} = await calendarApi.delete(`/events/${activeEvent.id}`);
                dispatch(onDeleteEvent() )
                return
            }
        } catch (error) {
            console.log(error)
            Swal.fire('Error en Eliminar',error.response.data.msg,'error')
        }
        
    }

    const startLoadingEvents = async ()=>{
        try {
            const {data} = await calendarApi.get('/events')
            const events = convertEventsToDateEvents(data.eventos)
            console.log(events)
            dispatch(onLoadEvent(events))
        } catch (error) {
            console.log(error)
        }

    }



    return {
        //properties
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,
        //methods
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvents

    }
}