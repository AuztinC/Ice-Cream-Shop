import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import { Link, Route, Routes, useParams, useNavigate } from 'react-router-dom'


const Home = ()=>{
  return (
    <h1>hello</h1>
  )
}
const Flavors = ({ flavors })=>{
  return (
    <ul>
      {
        flavors.map(flav=>{
          return (
            <li key={flav.id}> <Link to={`/flavors/${flav.id}`}> { flav.name } </Link></li>
          )
        })
      }
    </ul>
  )
}
const Flavor = ({ getFlavor, flavors, destroyFlavor, setFlavors })=>{
  const [flavor, setFlavor] = useState("")
  const [error, setError] = useState("")
  const id = useParams().id*1
  const flav = flavors.find(flav => flav.id === id)
  const navigate = useNavigate()

  useEffect(()=>{
    if(flav){
      try {
        SingleFalvor()
      } catch (error) {
        setError(error)
      }
    }
  }, [flavors])

  async function SingleFalvor(){
    const response = await getFlavor( flav.id )
    setFlavor(response[0])
  }

  async function handleClick(){
    await destroyFlavor( flav.id )
    navigate('/flavors')
    setFlavors(flavors.filter(fl => fl.id === flav.id ? null : fl.id))
  }

  if(!flavor){
    return null
  }
  return (<>
  { error ? <p>{error}</p> : null }
      <div> { flavor.id }</div>
      <div> { flavor.name }</div>
      <button onClick={handleClick}>Delete Flavor</button>
    </>)
}


function App() {
  const [flavors, setFlavors] = useState([])

  useEffect(()=>{
    getFlavors()
  }, [])

  const getFlavors = async()=> {
    const response = await axios.get('http://localhost:3000/api/flavors')
    setFlavors(response.data)
  }

  const getFlavor = async( id )=> {
    const response = await axios.get(`http://localhost:3000/api/flavors/${ id }`)
    return response.data
  }

  const destroyFlavor = async( id )=> {
    await axios.delete(`http://localhost:3000/api/flavors/${ id }`)
  }



  return (
    <>
    <form action="http://localhost:3000/flavors/add" method='GET'>
      <input type="text" name='flavor'/>
    </form>
    <h1>Ice Cream!</h1>
    <Link to={'/'}>Home</Link>
    <Link to={'/flavors'}>Flavors</Link>

    <Routes>
      <Route path='/' element={ <Home />} />
      <Route path='/flavors' element={ <Flavors flavors={flavors}/>}/>
      <Route path='/flavors/:id' element={ <Flavor setFlavors={setFlavors} destroyFlavor={destroyFlavor} flavors={flavors} getFlavor={getFlavor}/>}/>

    </Routes>
    </>
  )
}

export default App
