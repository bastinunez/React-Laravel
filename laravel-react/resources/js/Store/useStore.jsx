import {create} from 'zustand'



// export const useCartStore = create((set, get) => ({
//   items: [],
//   addItem: (item) => set((state) => ({ items: [...state.items, item] })),
//   removeItem: (id) =>
//     set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
//   totalPrice: () =>
//     get().items.reduce((total, item) => total + item.price, 0)
// }))

export const useSidebarStore = create((set,get)=>({
    sidebar: true,
    changeState: () => set((state) => ({ sidebar: !state.sidebar  })),
}))

