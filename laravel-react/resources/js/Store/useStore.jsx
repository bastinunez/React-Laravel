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
            changeState: () => set((state) => ({ sidebar: !state.sidebar  }))
        }),
        {
            name: 'sidebar-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        }
    )
)

export const useFormDocumentStore = create(
    persist(
        (set,get)=>({
            form_document_state: true,
            changeStateForm: () => set((state) => ({ form_document_state: !state.form_document_state  }))
        }),
        {
            name: 'form_document_state-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        }
    )
)

export const useIdDocumentStore = create(
    persist(
        (set,get)=>({
            id_document: 0,
            changeStateIdDoc: (id) => set({ id_document: id }),
        }),
        {
            name: 'id_document-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        }
    )   
)

export const useFormMiniDocumentStore = create(
    persist(
        (set,get)=>({
            form_mini_document_state: false,
            changeStateMiniForm: () => set((state) => ({ form_mini_document_state: !state.form_mini_document_state  }))
        }),
        {
            name: 'form_mini_document-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        }
    )
)