import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { addHours } from 'date-fns'
import { NavBar, CalendarModal, CalendarEvent, FabAddNew, FabDelete } from "../"

import { getMessagesES, localizer } from '../../helpers';

import { useEffect, useState } from 'react';
import { useAuthStores, useCalendarStore, useUiStore } from '../../hooks';





export const CalendarPage = () => {

  const { user } = useAuthStores()

  const { events, setActiveEvent, startLoadingEvents } = useCalendarStore()
  const { openDateModal } = useUiStore()

  const [lastView, setlastView] = useState(localStorage.getItem('lastView') || 'week')


  const eventStyleGetter = (event, start, end, isSelected) => {
    const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid)


    const style = {
      backgroundColor: isMyEvent ? '#347CF7' : '#465660',
      borderRadius: '0px',
      opacity: 0.5,
      color: 'white'

    }

    return {
      style
    }
  }

  const onDoubleClick = (event) => {
    openDateModal()
  }

  const onSelect = (event) => {

    setActiveEvent(event)
  }

  const onViewChanged = (event) => {

    localStorage.setItem('lastView', event)

  }
  useEffect(() => {
    startLoadingEvents()
  }, [])

  return (
    <>
      <NavBar />

      <Calendar
        culture='es'
        localizer={localizer}
        events={events}
        defaultView={lastView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 100px)' }}
        messages={getMessagesES()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChanged}


      />
      <CalendarModal />
      <FabAddNew />
      <FabDelete />
    </>
  )
}
