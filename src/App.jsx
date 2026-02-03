import { useState, useCallback, useEffect,useRef } from 'react'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import './App.css'

function App() {
  const [length,setlength] = useState(8);
  const [numAllowed,setNumAllowed] = useState(false);
  const [charAllowed,setCharAllowed] = useState(false);
  const [password,setPassword] = useState("");

  // usecallback(function,dependencies) --> It memoizes a function so React does not recreate it on every render unless dependencies change.
  // useEffect(function,dependencies) It’s used for side effects — things that happen because a component rendered, not during rendering.
  // useRef() no re-render, used for DOM access and persistent values
  const passRef = useRef(null);
  const passGenerator = useCallback(() =>{
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if(numAllowed) str+="0123456789";
    if(charAllowed) str+="!@#$%^&*()_+=-[]{}~`";
    for(let i=1;i<=length;i++){
      let char = str[Math.floor(Math.random() * str.length)];
      pass+=char;
    }
    setPassword(pass);
  },[length,numAllowed,charAllowed,setPassword])

  // with useRef() copy means here the selection effect that text is copied will be visible
  const copytoclipboard = useCallback(() =>{
    passRef.current?.select();  //in this ? is optional chaining means call select() only if passRef.current exists
    navigator.clipboard.writeText(password);
  },[password])

  // // if we want to just copy without ref
  // const copytoclipboard = useCallback(() => {
  //   window.navigator.clipboard.writeText(password)
  // },[password])

    useEffect(() =>{
      passGenerator()
    },[length,numAllowed,charAllowed,passGenerator])
  return (

      <div className='w-full max-w-3xl mx-auto shadow-md rounded-lg bg-red-500 px-4 py-3 my-8 text-white'>
             <header>
        {/* Show the sign-in and sign-up buttons when the user is signed out */}
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        {/* Show the user button when the user is signed in */}
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
        <h1 className='text-black text-center font-bold my-3'>Password Generator</h1>

        <div className='flex shadow-md rounded-lg overflow-hidden mb-6 mt-12 '>
            <input type="text" value={password} 
                   className='outline-none w-full bg-cyan-100 text-black text-center px-3 py-1'
                   readOnly
                   placeholder='Password'
                   ref={passRef}
            />
            <button className='outline-none bg-blue-700 px-3 py-1 cursor-pointer text-black font-bold shrink-0 hover:bg-blue-800 transition'
                    onClick={copytoclipboard}    >Copy</button>
        </div>  
        <div className='flex text-sm gap-x-5'>
            <div className='flex items-center gap-x-1'>
              <input 
                  type="range" 
                  min={6}
                  max = {100}
                  value={length}
                  className='cursor-pointer'
                  id='in'
                  onChange={(e) => {setlength(e.target.value)}}
              />
              <label htmlFor="in" className='text-black text-xl font-bold'>Length: {length}</label>
            </div>
            <div className='flex items-center gap-x-2'>
                <input type="checkbox"
                       defaultChecked = {numAllowed}
                       id='numinput'
                       onChange={() =>{
                          setNumAllowed((prev) => !prev);
                       }}
                      className='cursor-pointer scale-200'
                />
                <label htmlFor="numinput" className='font-bold text-xl text-black'>Numbers</label>
            </div>
            <div className='flex items-center gap-x-2'>
                <input type="checkbox"
                       defaultChecked = {charAllowed}
                       id='charinput'
                       onChange={() =>{
                          setCharAllowed((prev) => !prev);
                       }}
                      className='cursor-pointer scale-200'
                />
                <label htmlFor="charinput" className='font-bold text-xl text-black'>Characters</label>
            </div>
        </div>
      </div>      
    
  )
}

export default App
