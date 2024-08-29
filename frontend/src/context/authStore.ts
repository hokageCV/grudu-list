import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserType = {
    name:string,
    email:string,
    id:string,
    uid:string,
    client:string,
    accessToken:string,
}

type UserStore = {
    user:UserType,
    setUser:(newUser:UserType)=>void
}

type AuthStore = {
    isLoggedIn: boolean
    setIsLoggedIn: (isLoggedIn: boolean) => void
  }
  
export const useUserStore = create<UserStore>()(
    persist(
        (set)=>({
            user:{name:'',email:'',id:'',uid:'',client:'',accessToken:''},
            setUser:(newUser) => set({user:newUser}),
        }),
        {
            name:'user-storage',
        }
    )
)

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
    }),
    {
        name: 'template_user_is_logged_in' 
    }
  )
)