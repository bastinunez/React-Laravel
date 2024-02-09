import {create} from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


// export const useCartStore = create((set, get) => ({
//   items: [],
//   addItem: (item) => set((state) => ({ items: [...state.items, item] })),
//   removeItem: (id) =>
//     set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
//   totalPrice: () =>
//     get().items.reduce((total, item) => total + item.price, 0)
// }))

export const useSidebarStore = create( 
    persist(
        (set,get)=>({
            sidebar: true,
            changeState: () => set((state) => ({ sidebar: !state.sidebar  })),
            resetSidebar: () => set({ sidebar: true }),
        }),
        {
            name: 'sidebar-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        }
    )
)

export const useAccordionStore = create( 
    persist(
        (set,get)=>({
            accordion: 0,
            changeStateAccordion: (value) => set({ accordion: value }),
            resetAccordion: () => set({ accordion: 0 }),
        }),
        {
            name: 'accordion-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        }
    )
)



export const useActiveLinkStore = create(
    persist(
        (set,get)=>({
            activeLink: '',
            changeStateActiveLink: (value) => set({ activeLink: value }),
            resetActiveLink: () => set({ activeLink: '' }),
        }),
        {
            name: 'active-link', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        }
    )   
)

export const useFormMiniDocumentStore = create(
    persist(
        (set,get)=>({
            form_mini_document_state: false,
            changeStateMiniForm: () => set((state) => ({ form_mini_document_state: !state.form_mini_document_state  })),
            resetMiniForm: () => set({ form_mini_document_state: false}),
        }),
        {
            name: 'form_mini_document-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        }
    )
)