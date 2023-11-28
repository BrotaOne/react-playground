import { createContext, useContext } from "react";
import useLocalStorage from "../../../useLocalStorage";


export const TabStateContext = createContext<{
    tabItems: any[];
    setItems: (tabItems: any[]) => void;
}>({
    tabItems: [],
    setItems: ()=>{},
});


// // 同时提供持久化，和 Context 共享和修改
// const useTabState = () => {
    
//     const { tabItems: contextValue, setItems } = useContext(TabStateContext);
//     const [localStorageValue] = useLocalStorage('tab-items', []);

//     // return [value, setValue];
//     return [
//         contextValue.length > 0 ? contextValue.length : localStorageValue,
//         setItems,
//     ]
// }