import React, { useState, useEffect } from 'react'
import Person from './components/Person'
import Form from './components/Form'
import Filter from './components/Filter'
import contactService from './services/contacts'

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ showAll, setShowAll ] = useState(true)
  const [ newFilter, setNewFilter ] = useState('')
  const [ message, setMessage ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)

  const hook = () => {
    contactService
      .getAll()
      .then(initialContacts => {
        setPersons(initialContacts)
      })
  }
  
  useEffect(hook, [])

  const addContact = (event) => {
    event.preventDefault()
    const contactObject = {
      name: newName,
      number: newNumber
    }
    if (persons.map(x => x.name.toUpperCase()).includes(contactObject.name.toUpperCase())) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const contact = persons.find(n => n.name.toUpperCase() === contactObject.name.toUpperCase())
        const changedContact = { ...contact, number: contactObject.number}
        const contactid = contact.id

        contactService
        .update(contactid, changedContact)
        .then( returnedNote => {
        setPersons(persons.map(person => person.id !== contactid ? person : returnedNote))
        setMessage(
          `Successfully Updated the phone number of ${contact.name}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        })
        .catch(error => {
          setErrorMessage(
            `Information of ${contact.name} has already been deleted from the server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(n => n.id !== contactid))
        })
      }
    } else {
      contactService
      .create(contactObject)
      .then(returnedContact => {
        setPersons(persons.concat(returnedContact))
        setNewName('')
        setNewNumber('')
        setMessage(
          `Added ${contactObject.name}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
      console.log(error.response.data.error)
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      })
  }
}

  const handleDelete = (event) => {
    const result = window.confirm("Delete " + event.target.name + " ?")
    const id = event.target.value
    if (result) {
    contactService
    .remove(id)
    .then(hook)
    }
    setMessage(
      `Deleted ${event.target.name}`
    )
    setTimeout(() => {
      setMessage(null)
    }, 5000)

  }

  const contactsToShow = showAll
    ? persons
    : persons.filter(person => person.name.toUpperCase().startsWith(newFilter.toUpperCase()))

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
    if (event.target.value === '') {
      setShowAll(true)
    } else {
      setShowAll(false)
    }
  }

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="notification">
        {message}
      </div>
    )
  }

  const ErrorNotification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="errorNotification">
        {message}
      </div>
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <ErrorNotification message={errorMessage} />
      <Filter value={newFilter} onChange={handleFilterChange}/>
      <h1>add a new</h1>
      <Form addContact={addContact} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers:</h2>
      {contactsToShow.map(person => 
       <Person key={person.id} id={person.id} name={person.name} number={person.number} onClick={handleDelete} />
       )}
    </div>
  )

}

export default App